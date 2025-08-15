const axios = require('axios');
const { getSearchTerms, containsJapanese, translateJapaneseToEnglish } = require('../utils/cardNameTranslations');

const SCRYFALL_API_BASE = 'https://api.scryfall.com';

class ScryfallService {
  async searchCards(query, page = 1) {
    try {
      console.log(`Searching for: "${query}"`);
      
      // Get all possible search terms (original + translations)
      const searchTerms = getSearchTerms(query);
      console.log(`Search terms: ${searchTerms.join(', ')}`);
      
      let bestResult = { data: [], has_more: false, total_cards: 0 };
      let searchError = null;
      
      // Try each search term until we find results
      for (const searchTerm of searchTerms) {
        try {
          console.log(`Trying search term: "${searchTerm}"`);
          
          let response;
          try {
            // First try with include_multilingual flag
            response = await axios.get(`${SCRYFALL_API_BASE}/cards/search`, {
              params: {
                q: searchTerm,
                page: page,
                format: 'json',
                include_multilingual: true
              }
            });
          } catch (firstError) {
            console.log(`Multilingual search failed, trying basic search for: "${searchTerm}"`);
            // Fallback to basic search
            response = await axios.get(`${SCRYFALL_API_BASE}/cards/search`, {
              params: {
                q: searchTerm,
                page: page,
                format: 'json'
              }
            });
          }
          
          console.log(`Search successful for "${searchTerm}": found ${response.data.total_cards} results`);
          
          // If we found results, return them
          if (response.data.total_cards > 0) {
            return response.data;
          }
          
          // Keep the best result (even if 0 results) in case all searches fail
          if (response.data.total_cards >= bestResult.total_cards) {
            bestResult = response.data;
          }
          
        } catch (termError) {
          console.log(`Search failed for term "${searchTerm}": ${termError.message}`);
          searchError = termError;
          
          // If this is a 404, continue to next term
          if (termError.response && termError.response.status === 404) {
            continue;
          }
          
          // For other errors, we might want to continue trying other terms
          continue;
        }
      }
      
      // If we get here, no search term produced results
      console.log(`No results found for any search terms: ${searchTerms.join(', ')}`);
      return bestResult;
      
    } catch (error) {
      console.error(`Search error for "${query}":`, error.message);
      if (error.response && error.response.status === 404) {
        return { data: [], has_more: false, total_cards: 0 };
      }
      throw new Error(`Scryfall API error: ${error.response?.data?.details || error.message}`);
    }
  }

  async getCardByName(name) {
    try {
      console.log(`Getting card by name: "${name}"`);
      
      // Get all possible search terms (original + translations)
      const searchTerms = getSearchTerms(name);
      console.log(`Name search terms: ${searchTerms.join(', ')}`);
      
      // Try each search term
      for (const searchTerm of searchTerms) {
        try {
          console.log(`Trying to get card: "${searchTerm}"`);
          
          let response;
          try {
            // Try fuzzy search first
            response = await axios.get(`${SCRYFALL_API_BASE}/cards/named`, {
              params: { fuzzy: searchTerm }
            });
            console.log(`Found card with fuzzy search for: "${searchTerm}"`);
            return response.data;
          } catch (fuzzyError) {
            console.log(`Fuzzy search failed for "${searchTerm}", trying exact search`);
            // If fuzzy search fails, try exact search
            response = await axios.get(`${SCRYFALL_API_BASE}/cards/named`, {
              params: { exact: searchTerm }
            });
            console.log(`Found card with exact search for: "${searchTerm}"`);
            return response.data;
          }
        } catch (termError) {
          console.log(`Failed to find card with term "${searchTerm}": ${termError.message}`);
          // Continue to next term if this one fails
          continue;
        }
      }
      
      // If no term worked, throw error
      throw new Error(`Card not found: ${name} (tried: ${searchTerms.join(', ')})`);
      
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error(`Card not found: ${name}`);
      }
      throw new Error(`Scryfall API error: ${error.message}`);
    }
  }

  async getCardById(id) {
    try {
      const response = await axios.get(`${SCRYFALL_API_BASE}/cards/${id}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error(`Card not found with ID: ${id}`);
      }
      throw new Error(`Scryfall API error: ${error.message}`);
    }
  }

  async getRandomCard() {
    try {
      const response = await axios.get(`${SCRYFALL_API_BASE}/cards/random`);
      return response.data;
    } catch (error) {
      throw new Error(`Scryfall API error: ${error.message}`);
    }
  }

  async getCardWithJapanese(cardId) {
    try {
      console.log(`Getting card with Japanese data for ID: ${cardId}`);
      
      // First get the English card
      const englishCard = await this.getCardById(cardId);
      
      // Try to find Japanese version
      try {
        const printings = await axios.get(`${SCRYFALL_API_BASE}/cards/search`, {
          params: {
            q: `!"${englishCard.name}" lang:ja`,
            format: 'json'
          }
        });
        
        if (printings.data.total_cards > 0) {
          const japaneseCard = printings.data.data[0];
          
          // Merge English card with Japanese printed data
          const mergedCard = {
            ...englishCard,
            printed_name: japaneseCard.printed_name,
            printed_type_line: japaneseCard.printed_type_line,
            printed_text: japaneseCard.printed_text
          };
          
          console.log(`Found Japanese version for: ${englishCard.name}`);
          return mergedCard;
        }
      } catch (japaneseError) {
        console.log(`No Japanese version found for: ${englishCard.name}`);
      }
      
      // Return English card if no Japanese version found
      return englishCard;
      
    } catch (error) {
      console.error(`Error getting card with Japanese data:`, error.message);
      throw new Error(`Failed to get card with Japanese data: ${error.message}`);
    }
  }

  async searchCardsWithJapanese(query, page = 1) {
    try {
      console.log(`Searching cards with Japanese data for: "${query}"`);
      
      // First get the search results
      const searchResults = await this.searchCards(query, page);
      
      if (searchResults.total_cards === 0) {
        return searchResults;
      }
      
      // For each card, try to get Japanese version
      const cardsWithJapanese = await Promise.all(
        searchResults.data.map(async (card) => {
          try {
            return await this.getCardWithJapanese(card.id);
          } catch (error) {
            console.log(`Failed to get Japanese data for ${card.name}: ${error.message}`);
            return card; // Return original card if Japanese fetch fails
          }
        })
      );
      
      return {
        ...searchResults,
        data: cardsWithJapanese
      };
      
    } catch (error) {
      console.error(`Error in searchCardsWithJapanese:`, error.message);
      throw error;
    }
  }

  async getCardPrintings(cardName) {
    try {
      console.log(`Getting all printings for card: "${cardName}"`);
      
      // Search for all printings of this card name
      const response = await axios.get(`${SCRYFALL_API_BASE}/cards/search`, {
        params: {
          q: `!"${cardName}"`,
          unique: 'prints',
          order: 'released',
          format: 'json'
        }
      });
      
      console.log(`Found ${response.data.total_cards} printings for: ${cardName}`);
      return response.data.data;
      
    } catch (error) {
      console.error(`Error getting card printings for "${cardName}":`, error.message);
      if (error.response && error.response.status === 404) {
        return [];
      }
      throw new Error(`Scryfall API error: ${error.response?.data?.details || error.message}`);
    }
  }
}

module.exports = new ScryfallService();
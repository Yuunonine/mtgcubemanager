const express = require('express');
const scryfallService = require('../services/scryfallService');
const router = express.Router();

router.get('/search', async (req, res) => {
  try {
    const { q, page = 1, include_japanese = 'true' } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    let result;
    if (include_japanese === 'true') {
      result = await scryfallService.searchCardsWithJapanese(q, parseInt(page));
    } else {
      result = await scryfallService.searchCards(q, parseInt(page));
    }
    
    res.json(result.data || []);
  } catch (error) {
    console.error('Card search error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/random', async (req, res) => {
  try {
    const card = await scryfallService.getRandomCard();
    res.json(card);
  } catch (error) {
    console.error('Random card error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:name/printings', async (req, res) => {
  try {
    const { name } = req.params;
    const printings = await scryfallService.getCardPrintings(name);
    res.json(printings);
  } catch (error) {
    console.error('Card printings error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const card = await scryfallService.getCardByName(name);
    res.json(card);
  } catch (error) {
    console.error('Card lookup error:', error);
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

module.exports = router;
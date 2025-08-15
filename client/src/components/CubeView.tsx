import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Autocomplete,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Language as LanguageIcon, ViewList as ViewListIcon, ViewModule as ViewModuleIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { cubeApi, cardApi } from '../services/api';
import { CubeCard, Card as MTGCard } from '../types/Card';
import CubeAnalysis from './CubeAnalysis';
import { CardListView } from './CardListView';
import { SetSelector } from './SetSelector';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/i18n';
import { translateOracleText, translateRarity } from '../utils/cardTextTranslator';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`cube-tabpanel-${index}`}
      aria-labelledby={`cube-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const CubeView: React.FC = () => {
  const { cubeId } = useParams<{ cubeId: string }>();
  const { language, toggleLanguage } = useLanguage();
  const [tabValue, setTabValue] = useState(0);
  const [cards, setCards] = useState<CubeCard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MTGCard[]>([]);
  const [allSearchResults, setAllSearchResults] = useState<MTGCard[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchError, setSearchError] = useState<string>('');
  const [selectedCard, setSelectedCard] = useState<CubeCard | null>(null);
  const [cardDetailOpen, setCardDetailOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [setSelectorOpen, setSetSelectorOpen] = useState(false);
  const [selectedCardForSet, setSelectedCardForSet] = useState<MTGCard | null>(null);
  
  // 検索結果のページング
  const [searchPage, setSearchPage] = useState(1);
  const [searchPageSize, setSearchPageSize] = useState(12);
  const [totalSearchResults, setTotalSearchResults] = useState(0);

  useEffect(() => {
    if (cubeId) {
      loadCubeCards();
    }
  }, [cubeId]);

  const loadCubeCards = async () => {
    if (!cubeId) return;
    
    try {
      const data = await cubeApi.getCube(cubeId);
      setCards(data);
      setError('');
    } catch (error) {
      console.error('Failed to load cube cards:', error);
      setError('キューブの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleCardSearch = async (resetPage: boolean = true) => {
    if (!searchQuery.trim()) return;
    
    const currentPage = resetPage ? 1 : searchPage;
    setSearchLoading(true);
    setSearchError('');
    
    if (resetPage) {
      setSearchPage(1);
    }
    
    try {
      const results = await cardApi.searchCards(searchQuery.trim());
      console.log('Search results:', results);
      
      // 全結果を保存
      const allResults = Array.isArray(results) ? results : [];
      setAllSearchResults(allResults);
      setTotalSearchResults(allResults.length);
      
      // ページングを適用
      updateSearchResultsPage(allResults, currentPage);
      
      if (allResults.length === 0) {
        setSearchError(`「${searchQuery.trim()}」に一致するカードが見つかりませんでした`);
      }
    } catch (error: any) {
      console.error('Failed to search cards:', error);
      const errorMessage = error.response?.data?.message || error.message || 'カード検索に失敗しました';
      setSearchError(`検索エラー: ${errorMessage}`);
      setSearchResults([]);
      setAllSearchResults([]);
      setTotalSearchResults(0);
    } finally {
      setSearchLoading(false);
    }
  };

  const updateSearchResultsPage = (results: MTGCard[], page: number) => {
    const startIndex = (page - 1) * searchPageSize;
    const endIndex = startIndex + searchPageSize;
    const pageResults = results.slice(startIndex, endIndex);
    setSearchResults(pageResults);
  };

  const handleSearchPageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setSearchPage(page);
    updateSearchResultsPage(allSearchResults, page);
    // スクロール位置を検索結果の先頭に移動
    setTimeout(() => {
      const searchResultsElement = document.getElementById('search-results');
      if (searchResultsElement) {
        searchResultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleSearchPageSizeChange = (event: any) => {
    const newPageSize = event.target.value as number;
    setSearchPageSize(newPageSize);
    setSearchPage(1);
    updateSearchResultsPage(allSearchResults, 1);
  };

  const handleOpenSetSelector = (card: MTGCard) => {
    setSelectedCardForSet(card);
    setSetSelectorOpen(true);
  };

  const handleSelectPrinting = (selectedPrinting: MTGCard) => {
    if (selectedCardForSet) {
      handleAddCardWithPrinting(selectedCardForSet, selectedPrinting);
    }
  };

  const handleAddCardWithPrinting = async (baseCard: MTGCard, selectedPrinting: MTGCard) => {
    if (!cubeId) return;

    try {
      const cubeCard: CubeCard = {
        ...baseCard,
        quantity: 1,
        image_uris: baseCard.image_uris,
        selected_printing: selectedPrinting
      };
      
      
      await cubeApi.addCardToCube(cubeId, cubeCard);
      loadCubeCards();
      setError('');
    } catch (error: any) {
      console.error('Failed to add card to cube:', error);
      const errorMessage = error.response?.data?.message || error.message || 'カードの追加に失敗しました';
      setError(`追加エラー: ${errorMessage}`);
    }
  };

  const handleAddCard = async (card: MTGCard) => {
    if (!cubeId) return;

    try {
      const cubeCard: CubeCard = {
        ...card,
        quantity: 1,
        image_uris: card.image_uris
      };
      
      console.log('Adding card:', card.name, 'Image URIs:', card.image_uris);
      
      await cubeApi.addCardToCube(cubeId, cubeCard);
      loadCubeCards();
      setError('');
    } catch (error: any) {
      console.error('Failed to add card to cube:', error);
      const errorMessage = error.response?.data?.message || error.message || 'カードの追加に失敗しました';
      setError(`追加エラー: ${errorMessage}`);
    }
  };

  const handleRemoveCard = async (cardId: string) => {
    if (!cubeId) return;

    try {
      await cubeApi.removeCardFromCube(cubeId, cardId);
      loadCubeCards();
      setError('');
    } catch (error: any) {
      console.error('Failed to remove card from cube:', error);
      const errorMessage = error.response?.data?.message || error.message || 'カードの削除に失敗しました';
      setError(`削除エラー: ${errorMessage}`);
    }
  };

  const getCardImageUrl = (card: CubeCard): string => {
    // 選択されたセット版の画像を優先
    if (card.selected_printing?.image_uris) {
      return card.selected_printing.image_uris.normal || card.selected_printing.image_uris.small || '';
    }
    // フォールバック：元のカードの画像
    return card.image_uri || card.image_uris?.normal || card.image_uris?.small || '';
  };

  const handleCardClick = (card: CubeCard) => {
    setSelectedCard(card);
    setCardDetailOpen(true);
  };

  const handleCloseCardDetail = () => {
    setCardDetailOpen(false);
    setSelectedCard(null);
  };

  if (loading) {
    return <Typography>Loading cube...</Typography>;
  }

  const getDisplayName = (card: CubeCard | MTGCard) => {
    return language === 'ja' && card.printed_name ? card.printed_name : card.name;
  };

  const getDisplayTypeLine = (card: CubeCard | MTGCard) => {
    return language === 'ja' && card.printed_type_line ? card.printed_type_line : card.type_line;
  };

  const getDisplayOracleText = (card: CubeCard | MTGCard) => {
    if (language === 'ja') {
      // If Japanese printed text exists, use it
      if (card.printed_text) {
        return card.printed_text;
      }
      // Otherwise, translate English oracle text
      if (card.oracle_text) {
        return translateOracleText(card.oracle_text);
      }
    }
    return card.oracle_text;
  };

  const getDisplayRarity = (card: CubeCard | MTGCard) => {
    return language === 'ja' ? translateRarity(card.rarity) : card.rarity;
  };

  const getDisplayColors = (card: CubeCard | MTGCard) => {
    if (!card.colors || card.colors.length === 0) {
      return t('colorless', language);
    }
    return card.colors.join(', ');
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" component="h1">
          {t('cubeManager', language)}
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<LanguageIcon />}
            onClick={toggleLanguage}
          >
            {language === 'en' ? t('japanese', language) : t('english', language)}
          </Button>
        </Box>
      </Box>

      <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
        <Tab label={t('cards', language)} />
        <Tab label={t('analysis', language)} />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            {t('addCards', language)}
          </Typography>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              label={t('searchPlaceholder', language)}
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCardSearch(true)}
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="contained"
              onClick={() => handleCardSearch()}
              disabled={searchLoading}
              startIcon={searchLoading ? <CircularProgress size={20} /> : <AddIcon />}
            >
              {t('search', language)}
            </Button>
          </Box>

          {searchError && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              {searchError}
            </Alert>
          )}

          {totalSearchResults > 0 && (
            <Box mt={2} id="search-results">
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1">
                  {t('searchResults', language)} ({totalSearchResults}件中 {Math.min((searchPage - 1) * searchPageSize + 1, totalSearchResults)}-{Math.min(searchPage * searchPageSize, totalSearchResults)}件を表示)
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <FormControl size="small" sx={{ minWidth: 100 }}>
                    <InputLabel>{language === 'ja' ? '表示件数' : 'Per Page'}</InputLabel>
                    <Select
                      value={searchPageSize}
                      onChange={handleSearchPageSizeChange}
                      label={language === 'ja' ? '表示件数' : 'Per Page'}
                    >
                      <MenuItem value={6}>6</MenuItem>
                      <MenuItem value={12}>12</MenuItem>
                      <MenuItem value={18}>18</MenuItem>
                      <MenuItem value={24}>24</MenuItem>
                      <MenuItem value={36}>36</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              
              <Grid container spacing={2}>
                {searchResults.map((card) => (
                  <Grid item xs={12} sm={6} md={4} lg={2} key={card.id}>
                    <Card sx={{ height: '100%' }}>
                      {card.image_uris?.small && (
                        <CardMedia
                          component="img"
                          height="140"
                          image={card.image_uris.small}
                          alt={card.name}
                        />
                      )}
                      <CardContent sx={{ p: 1 }}>
                        <Typography variant="body2" noWrap title={getDisplayName(card)}>
                          {getDisplayName(card)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                          {card.mana_cost} • {getDisplayTypeLine(card)}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Button
                            size="small"
                            variant="contained"
                            sx={{ flex: 1 }}
                            onClick={() => handleAddCard(card)}
                          >
                            {t('add', language)}
                          </Button>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenSetSelector(card)}
                            title="セットを選択"
                          >
                            <SettingsIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {Math.ceil(totalSearchResults / searchPageSize) > 1 && (
                <Box display="flex" justifyContent="center" mt={3}>
                  <Pagination
                    count={Math.ceil(totalSearchResults / searchPageSize)}
                    page={searchPage}
                    onChange={handleSearchPageChange}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </Box>
          )}
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            {t('cubeCards', language)} ({cards.length})
          </Typography>
          <Box>
            <IconButton
              onClick={() => setViewMode('grid')}
              color={viewMode === 'grid' ? 'primary' : 'default'}
              title={language === 'ja' ? 'グリッド表示' : 'Grid View'}
            >
              <ViewModuleIcon />
            </IconButton>
            <IconButton
              onClick={() => setViewMode('list')}
              color={viewMode === 'list' ? 'primary' : 'default'}
              title={language === 'ja' ? 'リスト表示' : 'List View'}
            >
              <ViewListIcon />
            </IconButton>
          </Box>
        </Box>
        
        {viewMode === 'grid' ? (
          <Grid container spacing={2}>
            {cards.map((card) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={card.id}>
                <Card sx={{ height: '100%', cursor: 'pointer' }}>
                  <Box onClick={() => handleCardClick(card)}>
                    {getCardImageUrl(card) && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={getCardImageUrl(card)}
                        alt={card.name}
                      />
                    )}
                    <CardContent sx={{ p: 1 }}>
                      <Typography variant="body2" noWrap title={getDisplayName(card)}>
                        {getDisplayName(card)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {card.mana_cost} • {getDisplayTypeLine(card)}
                      </Typography>
                      <Typography variant="caption" display="block">
                        {t('quantity', language)}: {card.quantity}
                      </Typography>
                    </CardContent>
                  </Box>
                  <Box display="flex" justifyContent="flex-end" p={1}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCard(card.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <CardListView
            cards={cards}
            onCardClick={handleCardClick}
            onCardRemove={handleRemoveCard}
          />
        )}

        {cards.length === 0 && (
          <Box textAlign="center" mt={4}>
            <Typography variant="h6" color="text.secondary">
              {t('noCards', language)}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('useSearchAbove', language)}
            </Typography>
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <CubeAnalysis cubeId={cubeId} cards={cards} />
      </TabPanel>

      {/* Card Detail Dialog */}
      <Dialog
        open={cardDetailOpen}
        onClose={handleCloseCardDetail}
        maxWidth="md"
        fullWidth
      >
        {selectedCard && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center" gap={2}>
                {getCardImageUrl(selectedCard) && (
                  <CardMedia
                    component="img"
                    image={getCardImageUrl(selectedCard)}
                    alt={selectedCard.name}
                    sx={{ 
                      width: 60, 
                      height: 84, 
                      borderRadius: 1,
                      flexShrink: 0
                    }}
                  />
                )}
                <Box>
                  <Typography variant="h5" component="div">
                    {getDisplayName(selectedCard)}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {getDisplayTypeLine(selectedCard)}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  {getCardImageUrl(selectedCard) && (
                    <CardMedia
                      component="img"
                      image={getCardImageUrl(selectedCard)}
                      alt={selectedCard.name}
                      sx={{ maxWidth: '100%', height: 'auto' }}
                    />
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="body1" gutterBottom>
                      <strong>{t('manaCost', language)}:</strong> {selectedCard.mana_cost || 'N/A'}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>{t('cmc', language)}:</strong> {selectedCard.cmc}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>{t('rarity', language)}:</strong> {getDisplayRarity(selectedCard)}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>{t('set', language)}:</strong> {selectedCard.set}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>{t('colors', language)}:</strong> {getDisplayColors(selectedCard)}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>{t('quantityInCube', language)}:</strong> {selectedCard.quantity}
                    </Typography>
                    {(selectedCard.oracle_text || selectedCard.printed_text) && (
                      <Box mt={2}>
                        <Typography variant="body2" gutterBottom>
                          <strong>{t('oracleText', language)}:</strong>
                        </Typography>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                          {getDisplayOracleText(selectedCard)}
                        </Typography>
                      </Box>
                    )}
                    {selectedCard.prices && (
                      <Box mt={2}>
                        <Typography variant="body2" gutterBottom>
                          <strong>{t('price', language)}:</strong>
                        </Typography>
                        {selectedCard.prices.usd && (
                          <Typography variant="body2">
                            USD: ${selectedCard.prices.usd}
                          </Typography>
                        )}
                        {selectedCard.prices.eur && (
                          <Typography variant="body2">
                            EUR: €{selectedCard.prices.eur}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button
                color="error"
                onClick={() => {
                  handleRemoveCard(selectedCard.id);
                  handleCloseCardDetail();
                }}
              >
                {t('removeFromCube', language)}
              </Button>
              <Button onClick={handleCloseCardDetail}>{t('close', language)}</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Set Selector Dialog */}
      <SetSelector
        open={setSelectorOpen}
        onClose={() => setSetSelectorOpen(false)}
        cardName={selectedCardForSet?.name || ''}
        onSelectPrinting={handleSelectPrinting}
      />

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError('')} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CubeView;
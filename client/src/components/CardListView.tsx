import React, { useState, useMemo, useCallback, useTransition } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Typography,
  IconButton,
  Avatar,
  Slider,
  Switch,
  FormControlLabel,
  Collapse,
  Button,
  Skeleton,
  LinearProgress,
  Fade
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { CubeCard } from '../types/Card';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../utils/i18n';
import { translateRarity } from '../utils/cardTextTranslator';
import { useDebounce } from '../hooks/useDebounce';

interface CardListViewProps {
  cards: CubeCard[];
  onCardClick: (card: CubeCard) => void;
  onCardRemove: (cardId: string) => void;
}

interface CardRowProps {
  card: CubeCard;
  language: 'en' | 'ja';
  onCardClick: (card: CubeCard) => void;
  onCardRemove: (cardId: string) => void;
}

// メモ化されたカード行コンポーネント
const CardRow: React.FC<CardRowProps> = React.memo(({ card, language, onCardClick, onCardRemove }) => {
  const getDisplayName = (card: CubeCard) => {
    return language === 'ja' && card.printed_name ? card.printed_name : card.name;
  };

  const getDisplayTypeLine = (card: CubeCard) => {
    return language === 'ja' && card.printed_type_line ? card.printed_type_line : card.type_line;
  };

  const getDisplayRarity = (card: CubeCard) => {
    return language === 'ja' ? translateRarity(card.rarity) : card.rarity;
  };

  const getColorIdentity = (card: CubeCard) => {
    if (!card.color_identity || card.color_identity.length === 0) {
      return [colorMap.C];
    }
    return card.color_identity.map(color => colorMap[color as keyof typeof colorMap]).filter(Boolean);
  };

  return (
    <TableRow hover>
      <TableCell padding="checkbox" sx={{ width: 56 }}>
        <Avatar
          src={
            card.selected_printing?.image_uris?.small ||
            card.image_uri || 
            card.image_uris?.small
          }
          sx={{ width: 32, height: 32 }}
        />
      </TableCell>
      <TableCell sx={{ minWidth: 200 }}>
        <Typography variant="body2" fontWeight="bold" noWrap>
          {getDisplayName(card)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {card.mana_cost}
        </Typography>
      </TableCell>
      <TableCell sx={{ width: 80 }}>{card.cmc}</TableCell>
      <TableCell sx={{ width: 120 }}>
        <Box display="flex" gap={0.5} flexWrap="wrap">
          {getColorIdentity(card).map((color, index) => (
            <Chip
              key={index}
              label={color.symbol}
              size="small"
              sx={{ 
                backgroundColor: color.color,
                color: color.symbol === 'B' ? 'white' : 'black',
                minWidth: '24px',
                height: '20px',
                fontSize: '12px'
              }}
            />
          ))}
        </Box>
      </TableCell>
      <TableCell sx={{ minWidth: 150 }}>
        <Typography variant="body2" noWrap>
          {getDisplayTypeLine(card)}
        </Typography>
      </TableCell>
      <TableCell sx={{ width: 100 }}>
        <Chip
          label={getDisplayRarity(card)}
          size="small"
          variant="outlined"
        />
      </TableCell>
      <TableCell sx={{ width: 80 }}>
        <Typography variant="caption">
          {card.set?.toUpperCase()}
        </Typography>
      </TableCell>
      <TableCell sx={{ width: 80 }}>
        <Typography variant="body2">
          {card.quantity}
        </Typography>
      </TableCell>
      <TableCell sx={{ width: 120 }}>
        <Box display="flex" gap={0.5}>
          <IconButton
            size="small"
            onClick={() => onCardClick(card)}
            title={t('viewDetails', language)}
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => onCardRemove(card.id)}
            title={t('listRemove', language)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
});

type SortField = 'name' | 'cmc' | 'type_line' | 'rarity' | 'colors' | 'set' | 'quantity';
type SortDirection = 'asc' | 'desc';

interface FilterState {
  search: string;
  colors: string[];
  types: string[];
  rarities: string[];
  sets: string[];
  cmcRange: [number, number];
  quantityRange: [number, number];
}

const colorMap = {
  W: { name: 'White', color: '#FFFBD5', symbol: 'W' },
  U: { name: 'Blue', color: '#0E68AB', symbol: 'U' },
  B: { name: 'Black', color: '#150B00', symbol: 'B' },
  R: { name: 'Red', color: '#D3202A', symbol: 'R' },
  G: { name: 'Green', color: '#00733E', symbol: 'G' },
  C: { name: 'Colorless', color: '#CAC5C0', symbol: 'C' }
};

export const CardListView: React.FC<CardListViewProps> = ({
  cards,
  onCardClick,
  onCardRemove
}) => {
  const { language } = useLanguage();
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  // フィルター状態を分離：即座に反映するUI状態と、実際のフィルタリングに使用するデバウンスされた状態
  const [uiFilters, setUiFilters] = useState<FilterState>({
    search: '',
    colors: [],
    types: [],
    rarities: [],
    sets: [],
    cmcRange: [0, 20],
    quantityRange: [1, 10]
  });
  
  // デバウンスされたフィルター（検索のみデバウンス、他は即座に適用）
  const debouncedSearch = useDebounce(uiFilters.search, 300);
  
  // 実際のフィルター処理で使用する状態
  const filters = useMemo(() => ({
    ...uiFilters,
    search: debouncedSearch
  }), [uiFilters, debouncedSearch]);

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    const types = new Set<string>();
    const rarities = new Set<string>();
    const sets = new Set<string>();
    let maxCmc = 0;
    let maxQuantity = 0;

    cards.forEach(card => {
      if (card.type_line) {
        const mainType = card.type_line.split(' — ')[0].split(' ')[0];
        types.add(mainType);
      }
      if (card.rarity) rarities.add(card.rarity);
      if (card.set) sets.add(card.set.toUpperCase());
      maxCmc = Math.max(maxCmc, card.cmc || 0);
      maxQuantity = Math.max(maxQuantity, card.quantity || 1);
    });

    return {
      types: Array.from(types).sort(),
      rarities: Array.from(rarities).sort(),
      sets: Array.from(sets).sort(),
      maxCmc,
      maxQuantity
    };
  }, [cards]);

  // Helper functions for display (used in sorting logic)
  const getDisplayName = useCallback((card: CubeCard) => {
    return language === 'ja' && card.printed_name ? card.printed_name : card.name;
  }, [language]);

  const getDisplayTypeLine = useCallback((card: CubeCard) => {
    return language === 'ja' && card.printed_type_line ? card.printed_type_line : card.type_line;
  }, [language]);

  // Filter and sort cards with transition for smooth UI updates
  const filteredAndSortedCards = useMemo(() => {
    let filtered = cards.filter(card => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = getDisplayName(card).toLowerCase().includes(searchLower);
        const matchesType = getDisplayTypeLine(card)?.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesType) return false;
      }

      // Color filter
      if (filters.colors.length > 0) {
        const cardColors = card.color_identity || [];
        const hasColorlessFilter = filters.colors.includes('C');
        const hasColorFilter = filters.colors.filter(c => c !== 'C');
        
        if (hasColorlessFilter && cardColors.length === 0) {
          // Matches colorless filter
        } else if (hasColorFilter.length > 0) {
          const hasMatchingColor = hasColorFilter.some(color => cardColors.includes(color));
          if (!hasMatchingColor) return false;
        } else {
          return false;
        }
      }

      // Type filter
      if (filters.types.length > 0) {
        const cardType = card.type_line?.split(' — ')[0].split(' ')[0] || '';
        if (!filters.types.includes(cardType)) return false;
      }

      // Rarity filter
      if (filters.rarities.length > 0) {
        if (!filters.rarities.includes(card.rarity)) return false;
      }

      // Set filter
      if (filters.sets.length > 0) {
        if (!filters.sets.includes(card.set?.toUpperCase() || '')) return false;
      }

      // CMC range filter
      const cmc = card.cmc || 0;
      if (cmc < filters.cmcRange[0] || cmc > filters.cmcRange[1]) return false;

      // Quantity range filter
      const quantity = card.quantity || 1;
      if (quantity < filters.quantityRange[0] || quantity > filters.quantityRange[1]) return false;

      return true;
    });

    // Sort cards
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Special handling for display values
      if (sortField === 'name') {
        aValue = getDisplayName(a);
        bValue = getDisplayName(b);
      } else if (sortField === 'type_line') {
        aValue = getDisplayTypeLine(a);
        bValue = getDisplayTypeLine(b);
      } else if (sortField === 'rarity') {
        // Sort by rarity order: common < uncommon < rare < mythic
        const rarityOrder = { common: 1, uncommon: 2, rare: 3, mythic: 4 };
        aValue = rarityOrder[a.rarity as keyof typeof rarityOrder] || 5;
        bValue = rarityOrder[b.rarity as keyof typeof rarityOrder] || 5;
      } else if (sortField === 'colors') {
        aValue = (a.color_identity || []).length;
        bValue = (b.color_identity || []).length;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [cards, filters, sortField, sortDirection, language]);

  const handleSort = useCallback((field: SortField) => {
    startTransition(() => {
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    });
  }, [sortField, sortDirection]);

  const handleFilterChange = useCallback((key: keyof FilterState, value: any) => {
    // 検索以外は即座に適用、検索のみデバウンス
    if (key === 'search') {
      setUiFilters(prev => ({ ...prev, [key]: value }));
    } else {
      startTransition(() => {
        setUiFilters(prev => ({ ...prev, [key]: value }));
      });
    }
  }, []);

  const clearFilters = useCallback(() => {
    startTransition(() => {
      setUiFilters({
        search: '',
        colors: [],
        types: [],
        rarities: [],
        sets: [],
        cmcRange: [0, filterOptions.maxCmc],
        quantityRange: [1, filterOptions.maxQuantity]
      });
    });
  }, [filterOptions.maxCmc, filterOptions.maxQuantity]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (uiFilters.search) count++;
    if (uiFilters.colors.length > 0) count++;
    if (uiFilters.types.length > 0) count++;
    if (uiFilters.rarities.length > 0) count++;
    if (uiFilters.sets.length > 0) count++;
    if (uiFilters.cmcRange[0] > 0 || uiFilters.cmcRange[1] < filterOptions.maxCmc) count++;
    if (uiFilters.quantityRange[0] > 1 || uiFilters.quantityRange[1] < filterOptions.maxQuantity) count++;
    return count;
  }, [uiFilters, filterOptions]);

  return (
    <Box>
      {/* ローディング進捗バー */}
      <Box sx={{ position: 'relative' }}>
        {isPending && (
          <LinearProgress 
            sx={{ 
              position: 'absolute', 
              top: -2, 
              left: 0, 
              right: 0, 
              zIndex: 1 
            }} 
          />
        )}
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            {language === 'ja' ? 'リスト表示' : 'List View'} ({filteredAndSortedCards.length})
          </Typography>
        <Box>
          <Button
            startIcon={<FilterIcon />}
            onClick={() => setShowFilters(!showFilters)}
            variant={activeFilterCount > 0 ? "contained" : "outlined"}
          >
            {language === 'ja' ? 'フィルター' : 'Filters'}
            {activeFilterCount > 0 && ` (${activeFilterCount})`}
          </Button>
          {activeFilterCount > 0 && (
            <IconButton onClick={clearFilters} size="small" sx={{ ml: 1 }}>
              <ClearIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      <Collapse in={showFilters}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2}>
            {/* Search */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('listSearch', language)}
                value={uiFilters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder={language === 'ja' ? 'カード名やタイプで検索...' : 'Search by card name or type...'}
              />
            </Grid>

            {/* Colors */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>{language === 'ja' ? '色' : 'Colors'}</InputLabel>
                <Select
                  multiple
                  value={uiFilters.colors}
                  onChange={(e) => handleFilterChange('colors', e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((color) => (
                        <Chip
                          key={color}
                          label={colorMap[color as keyof typeof colorMap]?.symbol || color}
                          size="small"
                          sx={{ backgroundColor: colorMap[color as keyof typeof colorMap]?.color }}
                        />
                      ))}
                    </Box>
                  )}
                >
                  {Object.entries(colorMap).map(([key, { name }]) => (
                    <MenuItem key={key} value={key}>{name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Types */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>{language === 'ja' ? 'タイプ' : 'Types'}</InputLabel>
                <Select
                  multiple
                  value={uiFilters.types}
                  onChange={(e) => handleFilterChange('types', e.target.value)}
                >
                  {filterOptions.types.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Rarities */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>{language === 'ja' ? 'レアリティ' : 'Rarities'}</InputLabel>
                <Select
                  multiple
                  value={uiFilters.rarities}
                  onChange={(e) => handleFilterChange('rarities', e.target.value)}
                >
                  {filterOptions.rarities.map((rarity) => (
                    <MenuItem key={rarity} value={rarity}>
                      {language === 'ja' ? translateRarity(rarity) : rarity}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Sets */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>{language === 'ja' ? 'セット' : 'Sets'}</InputLabel>
                <Select
                  multiple
                  value={uiFilters.sets}
                  onChange={(e) => handleFilterChange('sets', e.target.value)}
                >
                  {filterOptions.sets.map((set) => (
                    <MenuItem key={set} value={set}>{set}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* CMC Range */}
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>
                {language === 'ja' ? '総マナ・コスト' : 'CMC'}: {uiFilters.cmcRange[0]} - {uiFilters.cmcRange[1]}
              </Typography>
              <Slider
                value={uiFilters.cmcRange}
                onChange={(_, value) => handleFilterChange('cmcRange', value)}
                min={0}
                max={filterOptions.maxCmc}
                valueLabelDisplay="auto"
              />
            </Grid>

            {/* Quantity Range */}
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>
                {language === 'ja' ? '数量' : 'Quantity'}: {uiFilters.quantityRange[0]} - {uiFilters.quantityRange[1]}
              </Typography>
              <Slider
                value={uiFilters.quantityRange}
                onChange={(_, value) => handleFilterChange('quantityRange', value)}
                min={1}
                max={filterOptions.maxQuantity}
                valueLabelDisplay="auto"
              />
            </Grid>
          </Grid>
        </Paper>
      </Collapse>

      <TableContainer component={Paper} sx={{ maxHeight: '70vh', overflow: 'auto' }}>
        <Table stickyHeader size="small" sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{ width: 56 }} />
              <TableCell sx={{ minWidth: 200 }}>
                <TableSortLabel
                  active={sortField === 'name'}
                  direction={sortField === 'name' ? sortDirection : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  {t('listName', language)}
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: 80 }}>
                <TableSortLabel
                  active={sortField === 'cmc'}
                  direction={sortField === 'cmc' ? sortDirection : 'asc'}
                  onClick={() => handleSort('cmc')}
                >
                  {language === 'ja' ? 'CMC' : 'CMC'}
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: 120 }}>
                <TableSortLabel
                  active={sortField === 'colors'}
                  direction={sortField === 'colors' ? sortDirection : 'asc'}
                  onClick={() => handleSort('colors')}
                >
                  {language === 'ja' ? '色' : 'Colors'}
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ minWidth: 150 }}>
                <TableSortLabel
                  active={sortField === 'type_line'}
                  direction={sortField === 'type_line' ? sortDirection : 'asc'}
                  onClick={() => handleSort('type_line')}
                >
                  {t('listType', language)}
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: 100 }}>
                <TableSortLabel
                  active={sortField === 'rarity'}
                  direction={sortField === 'rarity' ? sortDirection : 'asc'}
                  onClick={() => handleSort('rarity')}
                >
                  {language === 'ja' ? 'レアリティ' : 'Rarity'}
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: 80 }}>
                <TableSortLabel
                  active={sortField === 'set'}
                  direction={sortField === 'set' ? sortDirection : 'asc'}
                  onClick={() => handleSort('set')}
                >
                  {language === 'ja' ? 'セット' : 'Set'}
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: 80 }}>
                <TableSortLabel
                  active={sortField === 'quantity'}
                  direction={sortField === 'quantity' ? sortDirection : 'asc'}
                  onClick={() => handleSort('quantity')}
                >
                  {language === 'ja' ? '数量' : 'Qty'}
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ width: 120 }}>{t('listActions', language)}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody 
            sx={{ 
              opacity: isPending ? 0.7 : 1, 
              transition: 'opacity 0.3s ease-in-out' 
            }}
          >
            {filteredAndSortedCards.map((card) => (
              <CardRow
                key={card.id}
                card={card}
                language={language}
                onCardClick={onCardClick}
                onCardRemove={onCardRemove}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredAndSortedCards.length === 0 && !isPending && (
        <Fade in timeout={300}>
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary">
              {language === 'ja' ? 'フィルター条件に一致するカードがありません' : 'No cards match the current filters'}
            </Typography>
          </Box>
        </Fade>
      )}
      </Box>
    </Box>
  );
};
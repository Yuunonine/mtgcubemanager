import { Language } from '../contexts/LanguageContext';

export const translations = {
  en: {
    // General UI
    cubeManager: 'Cube Manager',
    cards: 'Cards',
    analysis: 'Analysis',
    addCards: 'Add Cards to Cube',
    searchPlaceholder: 'Search for cards...',
    search: 'Search',
    searchResults: 'Search Results',
    cubeCards: 'Cube Cards',
    noCards: 'No cards in this cube yet',
    useSearchAbove: 'Use the search above to add cards',
    
    // Card details
    manaCost: 'Mana Cost',
    cmc: 'CMC',
    rarity: 'Rarity',
    set: 'Set',
    colors: 'Colors',
    colorless: 'Colorless',
    quantity: 'Quantity',
    quantityInCube: 'Quantity in Cube',
    oracleText: 'Oracle Text',
    price: 'Price',
    removeFromCube: 'Remove from Cube',
    close: 'Close',
    add: 'Add',
    
    // Languages
    japanese: '日本語',
    english: 'English',
    
    // View modes
    gridView: 'Grid View',
    listView: 'List View',
    
    // List view specific
    filters: 'Filters',
    listSearch: 'Search',
    listName: 'Name',
    listType: 'Type',
    listActions: 'Actions',
    viewDetails: 'View Details',
    listRemove: 'Remove',
    noMatchingCards: 'No cards match the current filters'
  },
  ja: {
    // General UI
    cubeManager: 'キューブマネージャー',
    cards: 'カード',
    analysis: '分析',
    addCards: 'キューブにカードを追加',
    searchPlaceholder: 'カードを検索...',
    search: '検索',
    searchResults: '検索結果',
    cubeCards: 'キューブカード',
    noCards: 'このキューブにはまだカードがありません',
    useSearchAbove: '上の検索を使用してカードを追加してください',
    
    // Card details
    manaCost: 'マナ・コスト',
    cmc: '総マナ・コスト',
    rarity: 'レアリティ',
    set: 'セット',
    colors: '色',
    colorless: '無色',
    quantity: '数量',
    quantityInCube: 'キューブ内の数量',
    oracleText: 'オラクル・テキスト',
    price: '価格',
    removeFromCube: 'キューブから削除',
    close: '閉じる',
    add: '追加',
    
    // Languages
    japanese: '日本語',
    english: 'English',
    
    // View modes
    gridView: 'グリッド表示',
    listView: 'リスト表示',
    
    // List view specific
    filters: 'フィルター',
    listSearch: '検索',
    listName: 'カード名',
    listType: 'タイプ',
    listActions: 'アクション',
    viewDetails: '詳細表示',
    listRemove: '削除',
    noMatchingCards: 'フィルター条件に一致するカードがありません'
  }
};

export const t = (key: keyof typeof translations.en, language: Language): string => {
  return translations[language][key] || translations.en[key] || key;
};
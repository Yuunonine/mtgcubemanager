// Japanese to English MTG card name translations
// This mapping contains common Japanese card names and their English equivalents

const japaneseToEnglishMapping = {
  // 基本土地 (Basic Lands)
  '平地': 'Plains',
  '島': 'Island', 
  '沼': 'Swamp',
  '山': 'Mountain',
  '森': 'Forest',
  
  // 人気カード (Popular Cards)
  '稲妻': 'Lightning Bolt',
  '電光': 'Lightning Bolt',
  'ライトニング・ボルト': 'Lightning Bolt',
  '暗黒の儀式': 'Dark Ritual',
  'ダーク・リチュアル': 'Dark Ritual',
  '巨大化': 'Giant Growth',
  'ジャイアント・グロウス': 'Giant Growth',
  '対抗呪文': 'Counterspell',
  'カウンタースペル': 'Counterspell',
  '剣を鍬に': 'Swords to Plowshares',
  'ソーズ・トゥ・プラウシェアーズ': 'Swords to Plowshares',
  
  // パワー9 (Power 9)
  'ブラック・ロータス': 'Black Lotus',
  '黒蓮': 'Black Lotus',
  'タイムウォーク': 'Time Walk',
  '時間歩き': 'Time Walk',
  'アンセストラル・リコール': 'Ancestral Recall',
  '先祖の記憶': 'Ancestral Recall',
  'モックス・サファイア': 'Mox Sapphire',
  'モックス・ジェット': 'Mox Jet',
  'モックス・ルビー': 'Mox Ruby',
  'モックス・パール': 'Mox Pearl',
  'モックス・エメラルド': 'Mox Emerald',
  'ライブラリー・オブ・アレクサンドリア': 'Library of Alexandria',
  'アレクサンドリア図書館': 'Library of Alexandria',
  'タイムトゥイスター': 'Timetwister',
  '時のらせん': 'Timetwister',
  
  // 有名なクリーチャー (Famous Creatures)
  'ターモゴイフ': 'Tarmogoyf',
  'タルモゴイフ': 'Tarmogoyf',
  '瞬唱の魔道士スナップキャスター・メイジ': 'Snapcaster Mage',
  'スナップキャスター・メイジ': 'Snapcaster Mage',
  'デルバー・オブ・シークレッツ': 'Delver of Secrets',
  '秘密を掘り下げる者': 'Delver of Secrets',
  '若き紅蓮術士': 'Young Pyromancer',
  'ヤング・パイロマンサー': 'Young Pyromancer',
  
  // プレインズウォーカー (Planeswalkers)
  'ジェイス・ザ・マインド・スカルプター': 'Jace, the Mind Sculptor',
  '精神を刻む者、ジェイス': 'Jace, the Mind Sculptor',
  'リリアナ・オブ・ザ・ヴェール': 'Liliana of the Veil',
  'ヴェールのリリアナ': 'Liliana of the Veil',
  'チャンドラ・ナラー': 'Chandra Nalaar',
  'ガラク・ワイルドスピーカー': 'Garruk Wildspeaker',
  
  // 呪文 (Spells)
  '精神的つまづき': 'Mental Misstep',
  'メンタル・ミスステップ': 'Mental Misstep',
  '思考囲い': 'Thoughtseize',
  'ソートサイズ': 'Thoughtseize',
  '思考停止': 'Thoughtseize',
  'パス・トゥ・エグザイル': 'Path to Exile',
  '流刑への道': 'Path to Exile',
  'フォース・オブ・ウィル': 'Force of Will',
  '意志の力': 'Force of Will',
  
  // アーティファクト (Artifacts)
  'ソル・リング': 'Sol Ring',
  '太陽の指輪': 'Sol Ring',
  'マナ・クリプト': 'Mana Crypt',
  'マナの墓所': 'Mana Crypt',
  'スカルクランプ': 'Skullclamp',
  '頭蓋骨絞め': 'Skullclamp',
  'センギアの自動機械': 'Sensei\'s Divining Top',
  '師範の占い独楽': 'Sensei\'s Divining Top',
  
  // 土地 (Lands)
  'フェッチランド': 'Fetch Land',
  'ショックランド': 'Shock Land',
  'デュアルランド': 'Dual Land',
  'ウェイストランド': 'Wasteland',
  '不毛の大地': 'Wasteland',
  'ストリップマイン': 'Strip Mine',
  '露天鉱床': 'Strip Mine',
  
  // 一般的なタイプ (Common Types)
  'クリーチャー': 'Creature',
  'インスタント': 'Instant',
  'ソーサリー': 'Sorcery',
  'エンチャント': 'Enchantment',
  'アーティファクト': 'Artifact',
  'プレインズウォーカー': 'Planeswalker',
  '土地': 'Land'
};

// Function to translate Japanese card names to English
function translateJapaneseToEnglish(japaneseName) {
  // Direct mapping lookup
  const directTranslation = japaneseToEnglishMapping[japaneseName];
  if (directTranslation) {
    return directTranslation;
  }
  
  // Partial matching for compound names
  for (const [japanese, english] of Object.entries(japaneseToEnglishMapping)) {
    if (japaneseName.includes(japanese)) {
      return english;
    }
  }
  
  // If no translation found, return original
  return japaneseName;
}

// Function to check if a string contains Japanese characters
function containsJapanese(text) {
  const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
  return japaneseRegex.test(text);
}

// Function to get all possible search terms (original + translated)
function getSearchTerms(query) {
  const terms = [query.trim()];
  
  if (containsJapanese(query)) {
    const translated = translateJapaneseToEnglish(query.trim());
    if (translated !== query.trim()) {
      terms.push(translated);
    }
  }
  
  return terms;
}

module.exports = {
  japaneseToEnglishMapping,
  translateJapaneseToEnglish,
  containsJapanese,
  getSearchTerms
};
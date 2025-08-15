// MTGカード用語の英日翻訳辞書
export const mtgTermsTranslation: { [key: string]: string } = {
  // Basic terms
  'Instant': 'インスタント',
  'Sorcery': 'ソーサリー',
  'Creature': 'クリーチャー',
  'Artifact': 'アーティファクト',
  'Enchantment': 'エンチャント',
  'Planeswalker': 'プレインズウォーカー',
  'Land': '土地',
  'Legendary': '伝説の',
  'Basic': '基本',
  
  // Creature types
  'Human': '人間',
  'Wizard': 'ウィザード',
  'Warrior': '戦士',
  'Knight': '騎士',
  'Soldier': '兵士',
  'Beast': 'ビースト',
  'Dragon': 'ドラゴン',
  'Angel': '天使',
  'Demon': 'デーモン',
  'Vampire': 'バンパイア',
  'Zombie': 'ゾンビ',
  'Spirit': 'スピリット',
  'Elemental': 'エレメンタル',
  'Giant': 'ジャイアント',
  'Goblin': 'ゴブリン',
  'Elf': 'エルフ',
  'Dwarf': 'ドワーフ',
  
  // Keywords
  'Flying': '飛行',
  'Trample': 'トランプル',
  'Haste': '速攻',
  'Vigilance': '警戒',
  'Deathtouch': '接死',
  'Lifelink': '絆魂',
  'First strike': '先制攻撃',
  'Double strike': '二段攻撃',
  'Hexproof': '呪禁',
  'Indestructible': '破壊不能',
  'Menace': '威迫',
  'Reach': '到達',
  'Defender': '守備者',
  'Flash': '瞬速',
  'Prowess': '果敢',
  'Scry': '占術',
  'Surveil': '諜報',
  'Exile': '追放',
  'Graveyard': '墓地',
  'Battlefield': '戦場',
  'Library': 'ライブラリー',
  'Hand': '手札',
  
  // Actions
  'Draw': 'ドローする',
  'Discard': '捨てる',
  'Destroy': '破壊する',
  'Sacrifice': '生け贄に捧げる',
  'Search': '探す',
  'Shuffle': 'シャッフルする',
  'Tap': 'タップする',
  'Untap': 'アンタップする',
  'Counter': '打ち消す',
  'Deal': '与える',
  'damage': 'ダメージ',
  'target': '対象',
  'each': 'それぞれの',
  'all': 'すべての',
  'any': 'いずれかの',
  'opponent': '対戦相手',
  'you': 'あなた',
  'your': 'あなたの',
  'control': 'コントロールする',
  'own': '自分の',
  'enters the battlefield': '戦場に出る',
  'leaves the battlefield': '戦場を離れる',
  'dies': '死亡する',
  'beginning of': 'の開始時に',
  'end of': 'の終了時に',
  'turn': 'ターン',
  'upkeep': 'アップキープ',
  'draw step': 'ドロー・ステップ',
  'main phase': 'メイン・フェイズ',
  'combat': '戦闘',
  'end step': '終了ステップ',
  'mana': 'マナ',
  'cost': 'コスト',
  'ability': '能力',
  'activated ability': '起動型能力',
  'triggered ability': '誘発型能力',
  'static ability': '常在型能力',
  'spell': '呪文',
  'permanent': 'パーマネント'
};

export const translateOracleText = (text: string): string => {
  if (!text) return text;
  
  let translatedText = text;
  
  // Replace terms using the dictionary
  Object.entries(mtgTermsTranslation).forEach(([english, japanese]) => {
    // Case-insensitive replacement with word boundaries
    const regex = new RegExp(`\\b${english}\\b`, 'gi');
    translatedText = translatedText.replace(regex, japanese);
  });
  
  // Common patterns
  translatedText = translatedText
    // Numbers + damage
    .replace(/(\d+)\s+damage/gi, '$1点のダメージ')
    // +X/+Y patterns
    .replace(/\+(\d+)\/\+(\d+)/g, '+$1/+$2')
    // -X/-Y patterns  
    .replace(/-(\d+)\/-(\d+)/g, '-$1/-$2')
    // Mana symbols (keep as is for now)
    // {T} -> タップ
    .replace(/\{T\}/g, '{T}')
    // Common sentence patterns
    .replace(/When .+ enters the battlefield/gi, 'これが戦場に出たとき')
    .replace(/At the beginning of your upkeep/gi, 'あなたのアップキープの開始時に')
    // Numbers
    .replace(/\bone\b/gi, '1つの')
    .replace(/\btwo\b/gi, '2つの')
    .replace(/\bthree\b/gi, '3つの');
    
  return translatedText;
};

// Rarity translations
export const rarityTranslation: { [key: string]: string } = {
  'common': 'コモン',
  'uncommon': 'アンコモン',
  'rare': 'レア',
  'mythic': '神話レア',
  'special': 'スペシャル',
  'bonus': 'ボーナス'
};

export const translateRarity = (rarity: string): string => {
  return rarityTranslation[rarity.toLowerCase()] || rarity;
};
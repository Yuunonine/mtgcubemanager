function getCardColors(card) {
  if (!card.colors || card.colors.length === 0) {
    return ['colorless'];
  }
  if (card.colors.length > 1) {
    return ['multicolor'];
  }
  return card.colors.map(color => color.toLowerCase());
}

function getCardType(card) {
  const typeLine = card.type_line || '';
  const types = typeLine.split('—')[0].trim().split(/\s+/);
  return types[0] || 'Unknown';
}

function analyzeCube(cards) {
  const analysis = {
    totalCards: cards.length,
    colorDistribution: {
      white: 0,
      blue: 0,
      black: 0,
      red: 0,
      green: 0,
      multicolor: 0,
      colorless: 0
    },
    manaCurve: {},
    typeDistribution: {},
    rarityDistribution: {},
    averageCmc: 0
  };

  let totalCmc = 0;

  cards.forEach(card => {
    const colors = getCardColors(card);
    const cardType = getCardType(card);
    const cmc = card.cmc || 0;
    const rarity = card.rarity || 'unknown';

    colors.forEach(color => {
      const colorKey = {
        'w': 'white',
        'u': 'blue', 
        'b': 'black',
        'r': 'red',
        'g': 'green',
        'multicolor': 'multicolor',
        'colorless': 'colorless'
      }[color] || color;

      if (analysis.colorDistribution[colorKey] !== undefined) {
        analysis.colorDistribution[colorKey]++;
      }
    });

    analysis.manaCurve[cmc] = (analysis.manaCurve[cmc] || 0) + 1;

    analysis.typeDistribution[cardType] = (analysis.typeDistribution[cardType] || 0) + 1;

    analysis.rarityDistribution[rarity] = (analysis.rarityDistribution[rarity] || 0) + 1;

    totalCmc += cmc;
  });

  analysis.averageCmc = cards.length > 0 ? (totalCmc / cards.length).toFixed(2) : 0;

  for (let i = 0; i <= 10; i++) {
    if (!analysis.manaCurve[i]) {
      analysis.manaCurve[i] = 0;
    }
  }

  return analysis;
}

module.exports = {
  analyzeCube,
  getCardColors,
  getCardType
};
export interface Card {
  id: string;
  name: string;
  mana_cost: string;
  cmc: number;
  type_line: string;
  oracle_text: string;
  colors: string[];
  color_identity: string[];
  rarity: string;
  set: string;
  set_name?: string;
  collector_number?: string;
  released_at?: string;
  image_uris?: {
    small: string;
    normal: string;
    large: string;
  };
  prices?: {
    usd: string;
    eur: string;
  };
  // Japanese text fields
  printed_name?: string;
  printed_type_line?: string;
  printed_text?: string;
}

export interface CubeCard extends Card {
  quantity: number;
  notes?: string;
  tags?: string[];
  image_uri?: string;
  selected_printing?: Card; // 選択されたセット版のカード情報
}

export interface ColorDistribution {
  white: number;
  blue: number;
  black: number;
  red: number;
  green: number;
  multicolor: number;
  colorless: number;
}

export interface ManaCurve {
  [key: number]: number;
}

export interface CubeAnalysis {
  totalCards: number;
  colorDistribution: ColorDistribution;
  manaCurve: ManaCurve;
  typeDistribution: { [key: string]: number };
  rarityDistribution: { [key: string]: number };
  averageCmc: number;
}
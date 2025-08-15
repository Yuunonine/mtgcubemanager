# MTG Cubes API リファレンス

MTGキューブ管理システムのREST API仕様書です。

## 基本情報

- **Base URL**: `http://localhost:3001/api` (開発環境)
- **Content-Type**: `application/json`
- **認証**: なし（現在の版）
- **Rate Limit**: なし（Scryfall APIの制限に準拠）

## 共通レスポンス形式

### 成功レスポンス
```json
{
  "data": { /* リソースデータ */ },
  "status": "success"
}
```

### エラーレスポンス
```json
{
  "error": "エラーメッセージ",
  "status": "error",
  "code": 400
}
```

## Cards API

カード検索とデータ取得に関するエンドポイント。

### `GET /api/cards/search`

カードを検索します。

#### パラメータ
| 名前 | 型 | 必須 | 説明 | デフォルト |
|------|----|----|------|---------|
| `q` | string | ✓ | 検索クエリ | - |
| `page` | number | - | ページ番号 | 1 |
| `include_japanese` | boolean | - | 日本語データを含むか | true |

#### クエリ例
```
GET /api/cards/search?q=Lightning%20Bolt
GET /api/cards/search?q=稲妻&page=1
GET /api/cards/search?q=cmc:3%20t:creature
```

#### レスポンス
```json
[
  {
    "id": "e3285e6b-3e79-4d7c-bf96-d920f973b122",
    "name": "Lightning Bolt",
    "mana_cost": "{R}",
    "cmc": 1,
    "type_line": "Instant",
    "oracle_text": "Lightning Bolt deals 3 damage to any target.",
    "colors": ["R"],
    "color_identity": ["R"],
    "rarity": "common",
    "set": "lea",
    "set_name": "Limited Edition Alpha",
    "collector_number": "161",
    "released_at": "1993-08-05",
    "image_uris": {
      "small": "https://cards.scryfall.io/small/front/e/3/e3285e6b.jpg",
      "normal": "https://cards.scryfall.io/normal/front/e/3/e3285e6b.jpg",
      "large": "https://cards.scryfall.io/large/front/e/3/e3285e6b.jpg"
    },
    "prices": {
      "usd": "5.00",
      "eur": "4.50"
    },
    "printed_name": "稲妻",
    "printed_type_line": "インスタント",
    "printed_text": "稲妻は任意の対象に３点のダメージを与える。"
  }
]
```

#### エラーケース
- `400`: クエリパラメータ `q` が未指定
- `500`: Scryfall API エラー

---

### `GET /api/cards/:name`

指定したカード名の詳細情報を取得します。

#### パラメータ
| 名前 | 型 | 必須 | 説明 |
|------|----|----|------|
| `name` | string | ✓ | カード名（URLエンコード必須） |

#### クエリ例
```
GET /api/cards/Lightning%20Bolt
GET /api/cards/稲妻
```

#### レスポンス
```json
{
  "id": "e3285e6b-3e79-4d7c-bf96-d920f973b122",
  "name": "Lightning Bolt",
  "mana_cost": "{R}",
  "cmc": 1,
  "type_line": "Instant",
  "oracle_text": "Lightning Bolt deals 3 damage to any target.",
  "colors": ["R"],
  "color_identity": ["R"],
  "rarity": "common",
  "set": "lea",
  "image_uris": {
    "small": "https://cards.scryfall.io/small/front/e/3/e3285e6b.jpg",
    "normal": "https://cards.scryfall.io/normal/front/e/3/e3285e6b.jpg",
    "large": "https://cards.scryfall.io/large/front/e/3/e3285e6b.jpg"
  },
  "prices": {
    "usd": "5.00"
  }
}
```

#### エラーケース
- `404`: 指定したカードが見つからない
- `500`: Scryfall API エラー

---

### `GET /api/cards/:name/printings`

指定したカード名の全てのセット版を取得します。

#### パラメータ
| 名前 | 型 | 必須 | 説明 |
|------|----|----|------|
| `name` | string | ✓ | カード名（URLエンコード必須） |

#### クエリ例
```
GET /api/cards/Lightning%20Bolt/printings
```

#### レスポンス
```json
[
  {
    "id": "e3285e6b-3e79-4d7c-bf96-d920f973b122",
    "name": "Lightning Bolt",
    "set": "lea",
    "set_name": "Limited Edition Alpha",
    "collector_number": "161",
    "released_at": "1993-08-05",
    "rarity": "common",
    "image_uris": {
      "normal": "https://cards.scryfall.io/normal/front/e/3/e3285e6b.jpg"
    }
  },
  {
    "id": "f13c8e63-6161-4b77-a41b-2d2c1ecdf22b",
    "name": "Lightning Bolt", 
    "set": "leb",
    "set_name": "Limited Edition Beta",
    "collector_number": "161",
    "released_at": "1993-10-01",
    "rarity": "common",
    "image_uris": {
      "normal": "https://cards.scryfall.io/normal/front/f/1/f13c8e63.jpg"
    }
  }
]
```

---

### `GET /api/cards/random`

ランダムなカードを1枚取得します。

#### レスポンス
```json
{
  "id": "random-card-id",
  "name": "Random Card",
  "mana_cost": "{2}{G}",
  "cmc": 3,
  "type_line": "Creature — Beast",
  "oracle_text": "Random card text.",
  "colors": ["G"],
  "color_identity": ["G"],
  "rarity": "uncommon",
  "set": "dom",
  "image_uris": {
    "normal": "https://cards.scryfall.io/normal/front/..."
  }
}
```

## Cubes API

キューブ管理に関するエンドポイント。

### `GET /api/cubes`

全てのキューブの一覧を取得します。

#### レスポンス
```json
[
  {
    "id": "cube-uuid-1",
    "name": "Modern Cube",
    "description": "A cube featuring modern format staples",
    "cardCount": 540,
    "created_at": "2023-12-01T10:00:00.000Z",
    "updated_at": "2023-12-15T14:30:00.000Z"
  },
  {
    "id": "cube-uuid-2", 
    "name": "Vintage Cube",
    "description": "Powered cube with vintage cards",
    "cardCount": 360,
    "created_at": "2023-11-15T09:00:00.000Z",
    "updated_at": "2023-12-10T16:45:00.000Z"
  }
]
```

---

### `POST /api/cubes`

新しいキューブを作成します。

#### リクエストボディ
```json
{
  "name": "My New Cube",
  "description": "Optional description"
}
```

| フィールド | 型 | 必須 | 説明 |
|-----------|----|----|------|
| `name` | string | ✓ | キューブ名 |
| `description` | string | - | キューブの説明 |

#### レスポンス
```json
{
  "id": "new-cube-uuid",
  "name": "My New Cube", 
  "description": "Optional description",
  "created_at": "2023-12-20T10:00:00.000Z",
  "updated_at": "2023-12-20T10:00:00.000Z"
}
```

#### エラーケース
- `400`: 名前が未指定またはバリデーションエラー
- `500`: データベースエラー

---

### `GET /api/cubes/:cubeId`

指定したキューブのカード一覧を取得します。

#### パラメータ
| 名前 | 型 | 必須 | 説明 |
|------|----|----|------|
| `cubeId` | string | ✓ | キューブID |

#### レスポンス
```json
[
  {
    "id": "card-id-1",
    "name": "Lightning Bolt",
    "mana_cost": "{R}",
    "cmc": 1,
    "type_line": "Instant",
    "oracle_text": "Lightning Bolt deals 3 damage to any target.",
    "colors": ["R"],
    "color_identity": ["R"],
    "rarity": "common",
    "set": "lea",
    "quantity": 1,
    "notes": "Classic burn spell",
    "tags": ["burn", "removal"],
    "image_uri": "https://cards.scryfall.io/normal/front/e/3/e3285e6b.jpg",
    "image_uris": {
      "small": "https://cards.scryfall.io/small/front/e/3/e3285e6b.jpg",
      "normal": "https://cards.scryfall.io/normal/front/e/3/e3285e6b.jpg"
    },
    "selected_printing": {
      "id": "selected-printing-id",
      "set": "m10",
      "set_name": "Magic 2010",
      "image_uris": {
        "normal": "https://cards.scryfall.io/normal/front/..."
      }
    },
    "printed_name": "稲妻",
    "printed_type_line": "インスタント",
    "printed_text": "稲妻は任意の対象に３点のダメージを与える。",
    "added_at": "2023-12-15T14:30:00.000Z"
  }
]
```

#### エラーケース
- `404`: 指定したキューブが見つからない

---

### `POST /api/cubes/:cubeId/cards`

キューブにカードを追加します。

#### パラメータ
| 名前 | 型 | 必須 | 説明 |
|------|----|----|------|
| `cubeId` | string | ✓ | キューブID |

#### リクエストボディ
```json
{
  "id": "card-scryfall-id",
  "name": "Lightning Bolt",
  "mana_cost": "{R}",
  "cmc": 1,
  "type_line": "Instant", 
  "oracle_text": "Lightning Bolt deals 3 damage to any target.",
  "colors": ["R"],
  "color_identity": ["R"],
  "rarity": "common",
  "set": "lea",
  "quantity": 1,
  "notes": "Optional notes",
  "tags": ["burn", "removal"],
  "image_uris": {
    "small": "https://cards.scryfall.io/small/front/e/3/e3285e6b.jpg",
    "normal": "https://cards.scryfall.io/normal/front/e/3/e3285e6b.jpg"
  },
  "selected_printing": {
    "id": "selected-version-id",
    "set": "m10",
    "set_name": "Magic 2010",
    "image_uris": {
      "normal": "https://cards.scryfall.io/normal/front/..."
    }
  },
  "prices": {
    "usd": "5.00"
  }
}
```

#### レスポンス
```json
{
  "id": "database-record-id",
  "message": "Card added successfully"
}
```

#### エラーケース
- `400`: 必須フィールドの不足またはバリデーションエラー
- `404`: 指定したキューブが見つからない
- `409`: 同じカードが既に存在する場合（UNIQUE制約）
- `500`: データベースエラー

---

### `PATCH /api/cubes/:cubeId/cards/:cardId`

キューブ内のカード情報を更新します。

#### パラメータ
| 名前 | 型 | 必須 | 説明 |
|------|----|----|------|
| `cubeId` | string | ✓ | キューブID |
| `cardId` | string | ✓ | カードID |

#### リクエストボディ
```json
{
  "quantity": 2,
  "notes": "Updated notes",
  "tags": ["burn", "removal", "staple"]
}
```

#### レスポンス
```json
{
  "message": "Card updated successfully"
}
```

---

### `DELETE /api/cubes/:cubeId/cards/:cardId`

キューブからカードを削除します。

#### パラメータ
| 名前 | 型 | 必須 | 説明 |
|------|----|----|------|
| `cubeId` | string | ✓ | キューブID |
| `cardId` | string | ✓ | カードID |

#### レスポンス
```json
{
  "message": "Card removed successfully"
}
```

#### エラーケース
- `404`: 指定したキューブまたはカードが見つからない
- `500`: データベースエラー

---

### `GET /api/cubes/:cubeId/analysis`

キューブの詳細分析データを取得します。

#### パラメータ
| 名前 | 型 | 必須 | 説明 |
|------|----|----|------|
| `cubeId` | string | ✓ | キューブID |

#### レスポンス
```json
{
  "totalCards": 540,
  "averageCmc": 2.8,
  "colorDistribution": {
    "white": 108,
    "blue": 108, 
    "black": 108,
    "red": 108,
    "green": 108,
    "multicolor": 54,
    "colorless": 46
  },
  "manaCurve": {
    "0": 12,
    "1": 89,
    "2": 97,
    "3": 104,
    "4": 89,
    "5": 67,
    "6": 45,
    "7": 37
  },
  "typeDistribution": {
    "Creature": 180,
    "Instant": 89,
    "Sorcery": 78,
    "Enchantment": 34,
    "Artifact": 67,
    "Planeswalker": 12,
    "Land": 80
  },
  "rarityDistribution": {
    "common": 162,
    "uncommon": 216,
    "rare": 135,
    "mythic": 27
  }
}
```

## Health Check

### `GET /api/health`

アプリケーションの稼働状況を確認します。

#### レスポンス
```json
{
  "status": "OK",
  "timestamp": "2023-12-20T10:00:00.000Z"
}
```

## エラーハンドリング

### HTTPステータスコード

| コード | 説明 |
|-------|------|
| 200 | 成功 |
| 201 | リソース作成成功 |
| 204 | 成功（コンテンツなし） |
| 400 | 不正なリクエスト |
| 404 | リソースが見つからない |
| 409 | 競合（重複など） |
| 500 | サーバー内部エラー |

### エラーレスポンス例

```json
{
  "error": "Validation failed: name is required",
  "status": "error",
  "code": 400,
  "details": {
    "field": "name",
    "message": "name is required"
  }
}
```

## 制限事項

### Rate Limiting
- 現在のバージョンではRate Limitは実装されていません
- Scryfall APIの制限（10リクエスト/秒、1000リクエスト/日）に準拠してください

### データサイズ制限
- リクエストボディ: 最大 1MB
- アップロードファイル: 現在未対応

### 並行処理
- SQLiteの制限により、大量の同時書き込みは制限される場合があります
- WALモードを使用して並行性を向上

## SDK・ライブラリ

### JavaScript/TypeScript クライアント

```typescript
// client/src/services/api.ts での実装例
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export const cardApi = {
  searchCards: async (query: string): Promise<Card[]> => {
    const response = await api.get(`/cards/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  getCardByName: async (name: string): Promise<Card> => {
    const response = await api.get(`/cards/${encodeURIComponent(name)}`);
    return response.data;
  },

  getCardPrintings: async (name: string): Promise<Card[]> => {
    const response = await api.get(`/cards/${encodeURIComponent(name)}/printings`);
    return response.data;
  }
};

export const cubeApi = {
  getCube: async (cubeId: string): Promise<CubeCard[]> => {
    const response = await api.get(`/cubes/${cubeId}`);
    return response.data;
  },

  addCardToCube: async (cubeId: string, card: CubeCard): Promise<void> => {
    await api.post(`/cubes/${cubeId}/cards`, card);
  },

  removeCardFromCube: async (cubeId: string, cardId: string): Promise<void> => {
    await api.delete(`/cubes/${cubeId}/cards/${cardId}`);
  },

  analyzeCube: async (cubeId: string): Promise<CubeAnalysis> => {
    const response = await api.get(`/cubes/${cubeId}/analysis`);
    return response.data;
  }
};
```

## 変更履歴

### v1.0.0 (現在)
- 基本的なCRUD操作
- カード検索・追加機能
- セット選択機能
- キューブ分析機能
- 多言語対応

### 今後の予定
- 認証・認可機能
- エクスポート・インポート機能
- WebSocket対応（リアルタイム更新）
- GraphQL API
- Rate Limiting
- キャッシュ機能

---

ご質問やAPIの改善提案があれば、GitHubのIssueでお知らせください。
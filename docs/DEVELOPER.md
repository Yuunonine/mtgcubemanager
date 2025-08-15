# MTG Cubes 開発者ガイド

MTGキューブ管理システムの開発・カスタマイズ・拡張に関する技術情報を提供します。

## 目次

1. [開発環境のセットアップ](#開発環境のセットアップ)
2. [プロジェクト構造](#プロジェクト構造)
3. [技術スタックの詳細](#技術スタックの詳細)
4. [データベース設計](#データベース設計)
5. [API設計](#api設計)
6. [フロントエンド開発](#フロントエンド開発)
7. [バックエンド開発](#バックエンド開発)
8. [テスト](#テスト)
9. [デプロイメント](#デプロイメント)
10. [拡張とカスタマイズ](#拡張とカスタマイズ)

## 開発環境のセットアップ

### 前提条件

- **Node.js**: 18.0.0以上
- **npm**: 8.0.0以上  
- **Git**: 最新版
- **エディタ**: VS Code推奨（設定ファイル含む）

### 初期セットアップ

```bash
# リポジトリのクローン
git clone <repository-url>
cd mtgcubes

# 依存関係のインストール
npm run install:all

# 環境変数の設定（オプション）
cp server/.env.example server/.env

# 開発サーバーの起動
npm run dev
```

### 推奨VS Code拡張機能

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ms-vscode.vscode-json"
  ]
}
```

## プロジェクト構造

```
mtgcubes/
├── client/                     # React フロントエンド
│   ├── public/                 # 静的ファイル
│   ├── src/
│   │   ├── components/         # Reactコンポーネント
│   │   │   ├── CubeView.tsx   # メインのキューブ表示
│   │   │   ├── CubeAnalysis.tsx # 分析コンポーネント
│   │   │   ├── CardListView.tsx # カードリスト表示
│   │   │   └── SetSelector.tsx  # セット選択コンポーネント
│   │   ├── contexts/           # React Context
│   │   │   └── LanguageContext.tsx # 言語切り替え
│   │   ├── services/           # API通信
│   │   │   └── api.ts         # APIクライアント
│   │   ├── types/             # TypeScript型定義
│   │   │   └── Card.ts        # カード関連の型
│   │   ├── utils/             # ユーティリティ
│   │   │   ├── i18n.ts       # 国際化
│   │   │   └── cardTextTranslator.ts # テキスト翻訳
│   │   └── App.tsx            # ルートコンポーネント
│   ├── package.json           # クライアント依存関係
│   └── tsconfig.json          # TypeScript設定
├── server/                     # Node.js バックエンド
│   ├── controllers/            # コントローラー（未使用）
│   ├── models/                 # データベースモデル
│   │   └── database.js        # SQLiteデータベース抽象化
│   ├── routes/                # API ルーティング
│   │   ├── cards.js          # カード関連API
│   │   └── cubes.js          # キューブ関連API
│   ├── services/              # 外部サービス連携
│   │   └── scryfallService.js # Scryfall API クライアント
│   ├── utils/                 # ユーティリティ
│   │   ├── cubeAnalysis.js   # キューブ分析ロジック
│   │   └── cardNameTranslations.js # カード名翻訳
│   ├── data/                  # データファイル
│   │   └── cubes.db          # SQLiteデータベース
│   ├── index.js              # サーバーエントリーポイント
│   └── package.json          # サーバー依存関係
├── docker/                     # Docker設定
│   ├── Dockerfile            # マルチステージビルド
│   ├── docker-compose.yml    # サービス定義
│   ├── run.sh / run.ps1 / run.bat # 管理スクリプト
│   └── start.sh              # コンテナ起動スクリプト
├── docs/                       # ドキュメント
├── package.json               # ルート依存関係（ワークスペース管理）
└── CLAUDE.md                  # 開発者向け指示書
```

## 技術スタックの詳細

### フロントエンド

#### React 18 + TypeScript
- **Hook中心**: 関数コンポーネントとReact Hooks
- **厳密な型定義**: TypeScriptによる型安全性
- **モダンなReact**: Concurrent Features対応

#### Material-UI v5
- **デザインシステム**: Googleのマテリアルデザイン準拠
- **テーマ対応**: ダークモード・ライトモード（今後の拡張）
- **レスポンシブ**: モバイルファースト設計

#### 状態管理
- **React Context**: グローバル状態（言語設定）
- **useState**: ローカル状態管理
- **useEffect**: 副作用処理

### バックエンド

#### Node.js + Express
- **RESTful API**: 標準的なHTTPメソッド使用
- **ミドルウェア**: CORS、JSON解析、エラーハンドリング
- **非同期処理**: async/await パターン

#### SQLite
- **軽量データベース**: ファイルベースの組み込みDB
- **ACID準拠**: トランザクション処理対応
- **マイグレーション**: スキーマバージョン管理

#### Scryfall API
- **外部データソース**: 包括的なMTGカードデータベース
- **レート制限対応**: APIクォータ管理
- **キャッシュ戦略**: 不要な重複リクエストを回避

## データベース設計

### テーブル構造

#### cubes テーブル
```sql
CREATE TABLE cubes (
  id TEXT PRIMARY KEY,           -- UUID形式のキューブID
  name TEXT NOT NULL,            -- キューブ名
  description TEXT,              -- キューブの説明
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### cube_cards テーブル
```sql
CREATE TABLE cube_cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cube_id TEXT NOT NULL,         -- 外部キー（cubes.id）
  card_id TEXT NOT NULL,         -- Scryfall カードID
  card_name TEXT NOT NULL,       -- カード名
  mana_cost TEXT,                -- マナコスト
  cmc INTEGER,                   -- 変換マナコスト
  type_line TEXT,                -- カードタイプライン
  oracle_text TEXT,              -- カードテキスト
  colors TEXT,                   -- 色情報（JSON配列）
  color_identity TEXT,           -- 統率者色拘束（JSON配列）
  rarity TEXT,                   -- レアリティ
  set_code TEXT,                 -- セットコード
  quantity INTEGER DEFAULT 1,    -- 数量
  notes TEXT,                    -- メモ
  tags TEXT,                     -- タグ（JSON配列）
  image_uri TEXT,                -- 画像URI
  price_usd TEXT,                -- 価格（USD）
  printed_name TEXT,             -- 日本語印刷名
  printed_type_line TEXT,        -- 日本語タイプライン
  printed_text TEXT,             -- 日本語カードテキスト
  selected_printing TEXT,        -- 選択されたセット版情報（JSON）
  added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (cube_id) REFERENCES cubes (id) ON DELETE CASCADE,
  UNIQUE(cube_id, card_id)       -- 同一キューブ内での重複防止
);
```

### インデックス設計

```sql
-- パフォーマンス最適化用インデックス
CREATE INDEX idx_cube_cards_cube_id ON cube_cards(cube_id);
CREATE INDEX idx_cube_cards_name ON cube_cards(card_name);
CREATE INDEX idx_cubes_created_at ON cubes(created_at);
```

### マイグレーション管理

データベースクラス（`server/models/database.js`）で自動マイグレーションを実装：

```javascript
runMigrations() {
  // テーブル構造を確認し、不足するカラムを追加
  this.db.all("PRAGMA table_info(cube_cards)", (err, columns) => {
    const columnNames = columns.map(col => col.name);
    const requiredFields = ['printed_name', 'printed_type_line', 'printed_text', 'selected_printing'];
    
    requiredFields.forEach(field => {
      if (!columnNames.includes(field)) {
        this.db.run(`ALTER TABLE cube_cards ADD COLUMN ${field} TEXT`);
      }
    });
  });
}
```

## API設計

### RESTful API仕様

#### カード関連エンドポイント

```javascript
// カード検索
GET /api/cards/search
  Query Parameters:
    - q: 検索クエリ（必須）
    - page: ページ番号（デフォルト: 1）
    - include_japanese: 日本語データ含む（デフォルト: true）

// カード詳細取得
GET /api/cards/:name
  Parameters:
    - name: カード名（URLエンコード必須）

// カードの全セット版取得
GET /api/cards/:name/printings
  Parameters:
    - name: カード名（URLエンコード必須）

// ランダムカード取得
GET /api/cards/random
```

#### キューブ関連エンドポイント

```javascript
// キューブ一覧取得
GET /api/cubes
  Response: { id, name, description, cardCount }[]

// キューブ作成
POST /api/cubes
  Body: { name: string, description?: string }

// キューブのカード一覧取得
GET /api/cubes/:cubeId

// キューブにカード追加
POST /api/cubes/:cubeId/cards
  Body: CubeCard object

// キューブからカード削除
DELETE /api/cubes/:cubeId/cards/:cardId

// キューブ分析データ取得
GET /api/cubes/:cubeId/analysis
  Response: CubeAnalysis object
```

### エラーハンドリング

標準的なHTTPステータスコードを使用：

```javascript
// 成功レスポンス
200 OK          // 正常取得
201 Created     // リソース作成成功
204 No Content  // 削除成功

// エラーレスポンス
400 Bad Request    // リクエスト形式エラー
404 Not Found      // リソース未発見
500 Internal Error // サーバー内部エラー
```

## フロントエンド開発

### コンポーネント設計思想

#### 1. 単一責任の原則
各コンポーネントは一つの明確な責任を持つ：
- `CubeView`: キューブの表示・管理
- `SetSelector`: セット選択機能
- `CubeAnalysis`: 分析データ表示

#### 2. 再利用可能性
共通機能は独立したコンポーネントとして抽出：
- `CardListView`: カードリスト表示（グリッド・リスト両対応）
- 言語対応フック・ユーティリティ

#### 3. 型安全性
TypeScriptの厳密な型定義を活用：

```typescript
// 型定義例（client/src/types/Card.ts）
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
  // 日本語フィールド
  printed_name?: string;
  printed_type_line?: string;
  printed_text?: string;
}

export interface CubeCard extends Card {
  quantity: number;
  notes?: string;
  tags?: string[];
  image_uri?: string;
  selected_printing?: Card; // セット選択情報
}
```

### 状態管理パターン

#### Context API使用例
```typescript
// LanguageContext の実装
const LanguageContext = createContext<{
  language: 'en' | 'ja';
  toggleLanguage: () => void;
}>({
  language: 'en',
  toggleLanguage: () => {}
});

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
```

#### カスタムフック

```typescript
// API呼び出し用カスタムフック例
const useCubeCards = (cubeId: string) => {
  const [cards, setCards] = useState<CubeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!cubeId) return;
    
    const loadCards = async () => {
      try {
        setLoading(true);
        const result = await cubeApi.getCube(cubeId);
        setCards(result);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCards();
  }, [cubeId]);

  return { cards, loading, error, setCards };
};
```

## バックエンド開発

### Express アプリケーション構造

```javascript
// server/index.js - メインアプリケーション
const express = require('express');
const cors = require('cors');
const path = require('path');
const cardRoutes = require('./routes/cards');
const cubeRoutes = require('./routes/cubes');

const app = express();

// ミドルウェア設定
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API ルーティング
app.use('/api/cards', cardRoutes);
app.use('/api/cubes', cubeRoutes);

// ヘルスチェック
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 静的ファイル配信（プロダクション時）
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}
```

### データベースアクセスパターン

```javascript
// Promiseベースのデータベース操作
class Database {
  getCubeCards(cubeId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM cube_cards
        WHERE cube_id = ?
        ORDER BY card_name
      `;
      
      this.db.all(query, [cubeId], (err, rows) => {
        if (err) reject(err);
        else {
          // JSONフィールドのパース
          const cards = rows.map(row => ({
            ...row,
            colors: JSON.parse(row.colors || '[]'),
            tags: JSON.parse(row.tags || '[]'),
            selected_printing: JSON.parse(row.selected_printing || 'null')
          }));
          resolve(cards);
        }
      });
    });
  }
}
```

### Scryfall API連携

```javascript
// services/scryfallService.js
class ScryfallService {
  async searchCards(query, page = 1) {
    try {
      const response = await axios.get(`${SCRYFALL_API_BASE}/cards/search`, {
        params: {
          q: query,
          page: page,
          format: 'json',
          include_multilingual: true
        }
      });
      
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return { data: [], has_more: false, total_cards: 0 };
      }
      throw new Error(`Scryfall API error: ${error.message}`);
    }
  }

  async getCardPrintings(cardName) {
    // 特定カードの全セット版を取得
    const response = await axios.get(`${SCRYFALL_API_BASE}/cards/search`, {
      params: {
        q: `!"${cardName}"`,
        unique: 'prints',
        order: 'released'
      }
    });
    
    return response.data.data;
  }
}
```

## テスト

### テスト戦略

1. **ユニットテスト**: 個別関数・コンポーネントのテスト
2. **統合テスト**: API エンドポイントのテスト
3. **E2Eテスト**: ユーザーワークフローのテスト

### サーバーサイドテスト

```javascript
// server/tests/api.test.js (Jest使用例)
const request = require('supertest');
const app = require('../index');

describe('Cards API', () => {
  test('GET /api/cards/search should return search results', async () => {
    const response = await request(app)
      .get('/api/cards/search')
      .query({ q: 'Lightning Bolt' });
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
});

describe('Cubes API', () => {
  test('POST /api/cubes should create new cube', async () => {
    const cubeData = { name: 'Test Cube', description: 'Test Description' };
    
    const response = await request(app)
      .post('/api/cubes')
      .send(cubeData);
    
    expect(response.status).toBe(201);
    expect(response.body.name).toBe(cubeData.name);
  });
});
```

### フロントエンドテスト

```typescript
// client/src/__tests__/CubeView.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider } from '../contexts/LanguageContext';
import CubeView from '../components/CubeView';

const renderWithContext = (component: React.ReactElement) => {
  return render(
    <LanguageProvider>
      {component}
    </LanguageProvider>
  );
};

describe('CubeView', () => {
  test('renders search input', () => {
    renderWithContext(<CubeView />);
    
    const searchInput = screen.getByLabelText(/search/i);
    expect(searchInput).toBeInTheDocument();
  });

  test('language toggle works', () => {
    renderWithContext(<CubeView />);
    
    const languageButton = screen.getByRole('button', { name: /language/i });
    fireEvent.click(languageButton);
    
    // 言語切り替え後の確認
  });
});
```

## デプロイメント

### Docker環境

```dockerfile
# マルチステージビルドの例
FROM node:18-alpine AS base

# 依存関係インストール
WORKDIR /app
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/
RUN npm run install:all

# クライアントビルド
FROM base AS client-build
COPY client/ ./client/
RUN cd client && npm run build

# 本番環境イメージ
FROM node:18-alpine AS production
WORKDIR /app

# 本番用ファイルのコピー
COPY --from=server-build /app/server ./server
COPY --from=client-build /app/client/build ./client/build

# 非rootユーザーで実行
RUN addgroup -g 1001 -S nodejs && adduser -S mtgcube -u 1001
USER mtgcube

EXPOSE 3001
CMD ["node", "server/index.js"]
```

### 環境変数管理

```bash
# .env ファイル例
NODE_ENV=production
PORT=3001
DATABASE_PATH=./data/cubes.db
CORS_ORIGIN=*
```

### CI/CD パイプライン例

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm run install:all
      - run: npm run test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: docker build -f docker/Dockerfile -t mtgcubes:latest .
      - run: docker push registry/mtgcubes:latest
```

## 拡張とカスタマイズ

### 新機能の追加例

#### 1. 新しいカード分析機能

```javascript
// server/utils/cubeAnalysis.js に追加
function calculatePowerLevel(cards) {
  // カードのパワーレベル計算ロジック
  const powerCards = cards.filter(card => 
    card.rarity === 'mythic' || 
    POWER_CARDS.includes(card.name)
  );
  
  return {
    powerLevel: powerCards.length / cards.length,
    powerCards: powerCards.map(card => card.name)
  };
}
```

#### 2. エクスポート機能

```typescript
// client/src/services/api.ts に追加
export const cubeApi = {
  // 既存のメソッド...
  
  exportCube: async (cubeId: string, format: 'json' | 'csv' | 'txt'): Promise<Blob> => {
    const response = await api.get(`/cubes/${cubeId}/export`, {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  }
};
```

#### 3. カスタムフィールド追加

データベーススキーマの拡張：

```sql
-- 新しいカラム追加
ALTER TABLE cube_cards ADD COLUMN custom_rating INTEGER;
ALTER TABLE cube_cards ADD COLUMN custom_category TEXT;
```

型定義の更新：

```typescript
// client/src/types/Card.ts
export interface CubeCard extends Card {
  quantity: number;
  notes?: string;
  tags?: string[];
  image_uri?: string;
  selected_printing?: Card;
  // 新しいフィールド
  custom_rating?: number;
  custom_category?: string;
}
```

### テーマカスタマイズ

```typescript
// client/src/theme.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // カスタム色
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // カスタムボーダー
        },
      },
    },
  },
});
```

### プラグインアーキテクチャ

将来的な拡張のためのプラグインシステム設計：

```javascript
// server/plugins/pluginManager.js
class PluginManager {
  constructor() {
    this.plugins = new Map();
  }

  register(name, plugin) {
    this.plugins.set(name, plugin);
  }

  async executeHook(hookName, data) {
    for (const [name, plugin] of this.plugins) {
      if (plugin.hooks && plugin.hooks[hookName]) {
        data = await plugin.hooks[hookName](data);
      }
    }
    return data;
  }
}
```

## パフォーマンス最適化

### フロントエンド最適化

1. **コード分割**
```typescript
// React.lazy でのコンポーネント遅延読み込み
const CubeAnalysis = React.lazy(() => import('./CubeAnalysis'));

// 使用時
<Suspense fallback={<div>Loading...</div>}>
  <CubeAnalysis />
</Suspense>
```

2. **メモ化**
```typescript
// React.memo でのコンポーネントメモ化
export const CardItem = React.memo(({ card, onClick }: CardItemProps) => {
  return <div onClick={() => onClick(card.id)}>{card.name}</div>;
});

// useMemo での重い計算の最適化
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(cards);
}, [cards]);
```

### バックエンド最適化

1. **データベースクエリ最適化**
```sql
-- インデックス追加
CREATE INDEX idx_cube_cards_composite ON cube_cards(cube_id, card_name);

-- N+1問題回避のためのJOIN
SELECT c.*, cc.quantity, cc.notes
FROM cubes c
LEFT JOIN cube_cards cc ON c.id = cc.cube_id
WHERE c.id = ?;
```

2. **キャッシュ戦略**
```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10分キャッシュ

app.get('/api/cards/search', (req, res) => {
  const cacheKey = `search:${req.query.q}:${req.query.page}`;
  
  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json(cached);
  }
  
  // API呼び出し後にキャッシュ保存
});
```

## トラブルシューティング

### デバッグ技法

1. **フロントエンド デバッグ**
```typescript
// React Developer Tools での状態確認
// Chrome DevTools の Network タブでAPI確認
// console.log でのデータフロー追跡

useEffect(() => {
  console.log('Component mounted', { cubeId, cards });
}, [cubeId, cards]);
```

2. **バックエンド デバッグ**
```javascript
// 詳細ログの追加
const winston = require('winston');

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' })
  ]
});

// 使用例
logger.debug('Database query', { query, params });
```

### よくある問題と解決方法

1. **CORS エラー**
```javascript
// server/index.js で適切なCORS設定
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com'
    : 'http://localhost:3000',
  credentials: true
}));
```

2. **メモリリーク**
```typescript
// useEffect でのクリーンアップ
useEffect(() => {
  const interval = setInterval(() => {
    // 定期処理
  }, 1000);

  return () => clearInterval(interval); // クリーンアップ
}, []);
```

3. **SQLite ロック**
```javascript
// 適切なコネクション管理
class Database {
  constructor() {
    this.db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
    
    // WAL mode で並行性向上
    this.db.run("PRAGMA journal_mode = WAL");
    this.db.run("PRAGMA synchronous = NORMAL");
  }
}
```

---

このガイドがMTG Cubesの開発・カスタマイズに役立つことを願います。ご質問やフィードバックがあれば、GitHubのIssueでお知らせください。
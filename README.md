# MTG Cubes - マジック・ザ・ギャザリング キューブ管理システム

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-supported-blue.svg)](https://www.docker.com/)

Magic: The Gathering キューブの作成・管理・分析を行うWebアプリケーション。カードの検索・追加、キューブバランス分析、セット別画像選択など、キューブ構築に必要な機能を網羅しています。

## ✨ 主な機能

### 🎲 キューブ管理
- **マルチキューブ対応**: 複数のキューブを作成・管理
- **カード検索**: Scryfall APIを使用した日本語/英語対応の高速検索
- **セット選択**: 同じカードでも好みのセット版の画像を選択可能
- **バッチ操作**: 効率的なカードの一括管理

### 📊 詳細分析
- **カラーバランス分析**: 各色の配分と偏りを視覚化
- **マナカーブ分析**: マナコストごとのカード分布
- **カードタイプ分布**: クリーチャー、呪文、土地の比率
- **レアリティ分布**: カードの希少度バランス
- **統計レポート**: キューブの全体的な特徴を数値化

### 🌍 多言語対応
- **日英バイリンガル**: UI切り替えとカードテキスト翻訳
- **日本語カード検索**: 日本語カード名での検索対応
- **自動テキスト翻訳**: Oracle textの日本語表示

### 🖥️ ユーザーエクスペリエンス
- **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応
- **複数表示モード**: グリッド表示とリスト表示
- **リアルタイム更新**: 変更の即座反映
- **高速検索**: ページング機能付きの効率的な検索

## 🚀 クイックスタート

### Docker を使用（推奨）

最も簡単な起動方法：

```bash
# リポジトリをクローン
git clone <repository-url>
cd mtgcubes/docker

# アプリケーション起動
./run.sh up          # Linux/Mac
.\run.ps1 up         # Windows PowerShell
run.bat up           # Windows Command Prompt

# ブラウザでアクセス
# http://localhost:3001
```

詳細は [Docker セットアップガイド](docker/README.md) を参照してください。

### ローカル開発環境

```bash
# 依存関係のインストール
npm run install:all

# 開発サーバー起動
npm run dev

# アクセス
# フロントエンド: http://localhost:3000
# バックエンドAPI: http://localhost:3001
```

## 📋 システム要件

### 推奨環境
- **OS**: Windows 10/11, macOS 10.15+, Ubuntu 18.04+
- **RAM**: 4GB以上（8GB推奨）
- **ストレージ**: 2GB以上の空き容量
- **ブラウザ**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### 開発環境
- **Node.js**: 18.0.0以上
- **npm**: 8.0.0以上
- **Docker**: 20.10以上（Dockerを使用する場合）

## 🏗️ アーキテクチャ

### 技術スタック

#### フロントエンド
- **React 18** + **TypeScript**: モダンなUI開発
- **Material-UI v5**: 洗練されたコンポーネントライブラリ
- **Recharts**: インタラクティブなチャートとグラフ
- **Axios**: 型安全なAPI通信
- **React Router**: SPA ルーティング

#### バックエンド
- **Node.js** + **Express**: 高速なRESTful API
- **SQLite**: 軽量で高性能なデータベース
- **Scryfall API**: 包括的なMTGカードデータ
- **CORS対応**: セキュアなクロスオリジン通信

#### インフラストラクチャ
- **Docker**: コンテナ化された実行環境
- **Multi-stage Build**: 最適化されたイメージサイズ
- **ヘルスチェック**: アプリケーションの監視
- **永続化ボリューム**: データの安全な保存

### プロジェクト構造

```
mtgcubes/
├── client/                 # React フロントエンド
│   ├── src/
│   │   ├── components/     # UIコンポーネント
│   │   ├── services/       # API通信層
│   │   ├── types/          # TypeScript型定義
│   │   ├── contexts/       # React Context
│   │   └── utils/          # ユーティリティ関数
│   └── public/             # 静的アセット
├── server/                 # Node.js バックエンド
│   ├── controllers/        # ビジネスロジック
│   ├── models/             # データベース層
│   ├── routes/             # API ルーティング
│   ├── services/           # 外部API連携
│   └── utils/              # ヘルパー関数
├── docker/                 # Docker設定
│   ├── Dockerfile          # コンテナイメージ定義
│   ├── docker-compose.yml  # オーケストレーション
│   ├── run.sh             # Linux/Mac管理スクリプト
│   ├── run.ps1            # Windows PowerShell管理スクリプト
│   ├── run.bat            # Windows コマンドプロンプト管理スクリプト
│   └── README.md          # Docker詳細ガイド
└── docs/                   # ドキュメント
```

## 📖 ドキュメント

- **[Docker セットアップガイド](docker/README.md)** - コンテナでの実行方法
- **[Windows セットアップガイド](docker/WINDOWS.md)** - Windows環境での詳細設定
- **[ユーザーマニュアル](docs/USER_GUIDE.md)** - アプリケーションの使い方
- **[開発者ガイド](docs/DEVELOPER.md)** - 開発・カスタマイズ方法
- **[API リファレンス](docs/API.md)** - REST API仕様書

## 🎯 使用方法

### 基本的なワークフロー

1. **キューブ作成**: 新しいキューブプロジェクトを開始
2. **カード検索**: 日本語・英語でのカード検索
3. **セット選択**: 複数版があるカードで好みの版を選択
4. **キューブ構築**: カードを追加してキューブを構成
5. **バランス分析**: 統計とグラフでバランスを確認
6. **調整**: 分析結果を基にカードの追加・削除

### 主要機能の詳細

#### セット別画像選択 🖼️
同じカードでも異なるセットの画像を選択可能：
- カード検索結果で歯車アイコンをクリック
- セット選択ダイアログで希望するセット版を選択
- キューブ内で選択したセット版の画像が表示

#### 多言語対応 🌐
- 右上の言語切り替えボタンで日本語⇔英語を切り替え
- カード名、タイプ、テキストが自動翻訳
- 日本語での検索にも対応

#### 詳細分析 📈
- リアルタイムで更新される統計情報
- インタラクティブなチャートとグラフ
- エクスポート可能な分析レポート

## 🛠️ 開発・カスタマイズ

### 開発環境のセットアップ

```bash
# リポジトリのフォーク・クローン
git clone <your-fork-url>
cd mtgcubes

# 依存関係のインストール
npm run install:all

# 開発サーバーの起動
npm run dev

# 型チェック
npm run typecheck

# リント
npm run lint

# テスト実行
cd server && npm test
cd client && npm test
```

### ビルド・デプロイ

```bash
# プロダクションビルド
npm run build

# Docker イメージ作成
cd docker
./run.sh build

# プロダクション起動
npm start
# または
./run.sh up
```

## 🔧 設定・カスタマイズ

### 環境変数

```bash
# サーバー設定
PORT=3001                    # サーバーポート
NODE_ENV=production         # 実行環境

# データベース設定
DATABASE_PATH=./data/cubes.db  # SQLiteファイルパス

# API設定
SCRYFALL_API_BASE=https://api.scryfall.com  # Scryfall API URL
```

### カスタマイズポイント

- **テーマ色**: `client/src/theme.ts` でMaterial-UIテーマを変更
- **言語サポート**: `client/src/utils/i18n.ts` で翻訳を追加
- **分析ロジック**: `server/utils/cubeAnalysis.js` で分析アルゴリズムを変更
- **カード検索**: `server/services/scryfallService.js` で検索ロジックを拡張

## 🤝 コントリビューション

プロジェクトへの貢献を歓迎します！

1. **Issue報告**: バグ報告や機能要望
2. **プルリクエスト**: 機能追加や改善
3. **ドキュメント改善**: 説明の追加や修正
4. **翻訳**: 新しい言語のサポート

### 開発ルール

- TypeScriptの型安全性を維持
- ESLintルールに準拠
- コミットメッセージは日本語または英語
- テストの追加・更新

## 📞 サポート

### よくある質問

**Q: カードが見つからない場合は？**
A: Scryfallデータベースに登録されているカードのみ検索可能です。日本語名と英語名の両方で試してください。

**Q: データはどこに保存される？**
A: Dockerを使用する場合はボリュームに、ローカル実行時は`server/data/`ディレクトリに保存されます。

**Q: 他の人とキューブを共有できる？**
A: 現在はローカル使用のみです。共有機能は将来の機能として検討中です。

### トラブルシューティング

- **起動しない**: [Docker トラブルシューティング](docker/README.md#トラブルシューティング)
- **Windows固有の問題**: [Windows セットアップガイド](docker/WINDOWS.md)
- **パフォーマンス問題**: システム要件とリソース設定を確認

### バグ報告・機能要望

GitHubのIssueページで報告してください：
- バグ報告: 再現手順と環境情報を記載
- 機能要望: 具体的な使用例と目的を説明

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 🙏 謝辞

- **Scryfall**: 包括的なMTGカードデータベースの提供
- **Wizards of the Coast**: Magic: The Gatheringの素晴らしいゲーム
- **オープンソースコミュニティ**: 使用したライブラリとツールの開発者の皆様

---

このプロジェクトがMTGキューブ愛好者のお役に立てれば幸いです。Happy Cubing! 🎲✨
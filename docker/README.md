# MTG Cubes Docker Setup

このディレクトリには、MTGキューブ管理アプリケーションをDockerコンテナで実行するためのファイルが含まれています。

## 前提条件

- Docker Desktop (Windows/Mac/Linux)
- Docker Compose (Docker Desktopに含まれています)
- 8GB以上のRAM（推奨）

### Windows環境での追加要件
- Windows 10/11 (WSL2対応版)
- PowerShell 5.1+ または PowerShell Core 7+ (推奨)

## クイックスタート

### 1. リポジトリのクローンと移動
```bash
# プロジェクトのルートディレクトリにいることを確認
cd /path/to/mtgcubes

# dockerディレクトリに移動
cd docker
```

### 2. アプリケーションの起動

#### Linux/Mac環境:
```bash
# 管理スクリプトを使用（推奨）
./run.sh up

# または直接docker-composeを使用
docker-compose up -d --build
```

#### Windows環境:
```powershell
# PowerShellを使用（推奨）
.\run.ps1 up

# またはコマンドプロンプトを使用
run.bat up

# または直接docker-composeを使用
docker-compose up -d --build
```

### 3. アプリケーションへのアクセス
ブラウザで http://localhost:3001 にアクセスしてください。

## 管理スクリプト

### Linux/Mac環境
`run.sh` スクリプトを使用してアプリケーションを簡単に管理できます：

```bash
# アプリケーションの起動
./run.sh up

# アプリケーションの停止
./run.sh down

# ログの表示
./run.sh logs

# コンテナの状態確認
./run.sh status

# Dockerイメージの再ビルド
./run.sh rebuild

# コンテナ内でのシェル実行
./run.sh shell

# データベースのバックアップ
./run.sh backup

# データベースの復元
./run.sh restore

# 完全なクリーンアップ（注意：データが削除されます）
./run.sh clean

# ヘルプの表示
./run.sh help
```

### Windows環境

#### PowerShellを使用（推奨）:
```powershell
# アプリケーションの起動
.\run.ps1 up

# アプリケーションの停止
.\run.ps1 down

# ログの表示
.\run.ps1 logs

# コンテナの状態確認
.\run.ps1 status

# Dockerイメージの再ビルド
.\run.ps1 rebuild

# コンテナ内でのシェル実行
.\run.ps1 shell

# データベースのバックアップ
.\run.ps1 backup

# データベースの復元
.\run.ps1 restore

# 完全なクリーンアップ（注意：データが削除されます）
.\run.ps1 clean

# ヘルプの表示
.\run.ps1 help
```

#### コマンドプロンプトを使用:
```cmd
# アプリケーションの起動
run.bat up

# アプリケーションの停止
run.bat down

# ログの表示
run.bat logs

# コンテナの状態確認
run.bat status

# Dockerイメージの再ビルド
run.bat rebuild

# コンテナ内でのシェル実行
run.bat shell

# データベースのバックアップ
run.bat backup

# ヘルプの表示
run.bat help
```

注意: コマンドプロンプト版では一部の高度な機能（データベース復元など）が制限されています。

## Docker Compose コマンド

管理スクリプトを使わない場合の基本的なDocker Composeコマンド：

```bash
# アプリケーションの起動（バックグラウンド）
docker-compose up -d

# アプリケーションの起動（フォアグラウンド、ログ表示）
docker-compose up

# アプリケーションの停止
docker-compose down

# ログの表示
docker-compose logs -f

# コンテナの状態確認
docker-compose ps

# イメージの再ビルド
docker-compose build --no-cache

# コンテナ内でシェル実行
docker-compose exec mtgcubes /bin/sh
```

## ファイル構成

```
docker/
├── Dockerfile              # Dockerイメージのビルド定義
├── docker-compose.yml      # Docker Composeの設定
├── start.sh                # コンテナ起動スクリプト（Linux）
├── run.sh                  # 管理スクリプト（Linux/Mac）
├── run.ps1                 # 管理スクリプト（Windows PowerShell）
├── run.bat                 # 管理スクリプト（Windows コマンドプロンプト）
├── .env                    # 環境変数
├── .env.example            # 環境変数のテンプレート
└── README.md               # このファイル
```

## データの永続化

アプリケーションデータは以下のDockerボリュームに保存されます：

- `mtgcubes-data`: SQLiteデータベースファイル
- `mtgcubes-logs`: アプリケーションログ（オプション）

## 環境設定

`.env` ファイルで環境変数をカスタマイズできます：

```bash
# ポート番号（デフォルト: 3001）
PORT=3001

# Node.js環境（production/development）
NODE_ENV=production
```

## トラブルシューティング

### ポートが既に使用されている場合

#### Linux/Mac:
```bash
# 使用中のポートを確認
lsof -i :3001

# .envファイルでポートを変更
echo "PORT=3002" >> .env
```

#### Windows:
```powershell
# 使用中のポートを確認
netstat -ano | findstr :3001

# .envファイルでポートを変更
echo "PORT=3002" | Out-File -Append .env
```

### データベースの問題
```bash
# データベースをバックアップ
./run.sh backup

# コンテナとボリュームを完全削除（データも削除されます）
./run.sh clean

# 新しいコンテナを起動
./run.sh up
```

### メモリ不足
```bash
# Dockerのリソース制限を確認・調整
docker system info

# 不要なイメージとコンテナを削除
docker system prune -a
```

### ログの確認

#### Linux/Mac:
```bash
# アプリケーションログ
./run.sh logs

# Dockerシステムログ
docker system events
```

#### Windows:
```powershell
# アプリケーションログ
.\run.ps1 logs

# Dockerシステムログ
docker system events
```

### Windows固有の問題

#### PowerShell実行ポリシーのエラー
```powershell
# 実行ポリシーを確認
Get-ExecutionPolicy

# 現在のユーザーに対して実行を許可
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### WSL2の問題
```bash
# WSL2の状態確認
wsl --status

# WSL2の再起動
wsl --shutdown
```

#### Docker Desktopの問題
1. Docker Desktopを再起動
2. WSL2統合が有効になっていることを確認
3. リソース設定でメモリを4GB以上に設定

## 開発用途

開発環境で使用する場合：

```bash
# 開発モードで起動（ライブリロード有効）
NODE_ENV=development ./run.sh up

# ボリュームマウントで開発
# docker-compose.yml を編集してソースコードをマウント
```

## セキュリティ

本番環境で使用する場合の推奨事項：

1. 適切なファイアウォールの設定
2. HTTPSの設定（リバースプロキシ使用）
3. 定期的なセキュリティアップデート
4. データベースの定期バックアップ

## サポート

問題が発生した場合：

1. ログを確認: `./run.sh logs`
2. コンテナの状態を確認: `./run.sh status`
3. 必要に応じて再起動: `./run.sh down && ./run.sh up`
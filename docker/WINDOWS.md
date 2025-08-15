# MTG Cubes - Windows環境でのセットアップガイド

このガイドでは、Windows環境でMTGキューブ管理アプリケーションをDockerで実行する方法を詳しく説明します。

## 前提条件

### 1. システム要件
- Windows 10 (version 2004以降) または Windows 11
- WSL2が利用可能
- 8GB以上のRAM
- 10GB以上の空きディスク容量

### 2. 必要なソフトウェア
- **Docker Desktop for Windows** (最新版)
- **PowerShell** (推奨) または コマンドプロンプト

## セットアップ手順

### ステップ 1: Docker Desktopのインストール

1. [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)をダウンロード
2. インストーラーを実行
3. インストール中に「WSL 2 instead of Hyper-V」を選択
4. インストール完了後、Windowsを再起動

### ステップ 2: WSL2の設定確認

1. PowerShellを管理者として実行
2. 以下のコマンドでWSL2の状態を確認:
```powershell
wsl --status
```

3. 必要に応じてWSL2を有効化:
```powershell
# Windows機能の有効化
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# WSL2をデフォルトに設定
wsl --set-default-version 2
```

### ステップ 3: Docker Desktopの設定

1. Docker Desktopを起動
2. 設定画面（⚙アイコン）を開く
3. **General** タブで以下を確認:
   - ☑ Use WSL 2 based engine
4. **Resources** タブで以下を設定:
   - Memory: 4GB以上（推奨: 6GB）
   - CPU: 2コア以上
5. **WSL Integration** タブで:
   - ☑ Enable integration with my default WSL distro
6. 設定を保存し、Docker Desktopを再起動

### ステップ 4: アプリケーションの取得

1. プロジェクトをダウンロード/クローン
2. PowerShellまたはコマンドプロンプトを開く
3. プロジェクトの`docker`ディレクトリに移動:

```powershell
cd "C:\path\to\mtgcubes\docker"
```

### ステップ 5: アプリケーションの起動

#### PowerShellを使用する場合（推奨）:

1. 実行ポリシーの確認と設定（初回のみ）:
```powershell
# 現在のポリシーを確認
Get-ExecutionPolicy

# 必要に応じて変更
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

2. アプリケーションの起動:
```powershell
.\run.ps1 up
```

#### コマンドプロンプトを使用する場合:
```cmd
run.bat up
```

### ステップ 6: アクセス確認

1. ブラウザで http://localhost:3001 にアクセス
2. MTGキューブ管理画面が表示されることを確認

## 基本的な操作

### PowerShell版コマンド

```powershell
# 起動
.\run.ps1 up

# 停止
.\run.ps1 down

# ログ確認
.\run.ps1 logs

# 状態確認
.\run.ps1 status

# データベースバックアップ
.\run.ps1 backup

# ヘルプ表示
.\run.ps1 help
```

### コマンドプロンプト版コマンド

```cmd
# 起動
run.bat up

# 停止
run.bat down

# ログ確認
run.bat logs

# 状態確認
run.bat status

# データベースバックアップ
run.bat backup

# ヘルプ表示
run.bat help
```

## よくある問題と解決方法

### 問題 1: PowerShell実行ポリシーエラー
```
実行ポリシーによりスクリプトの実行が無効になっています
```

**解決方法:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 問題 2: Docker Desktopが起動しない
```
Docker Desktop is starting...
```

**解決方法:**
1. Windowsを再起動
2. WSL2の状態確認: `wsl --status`
3. 必要に応じてWSL2を再起動: `wsl --shutdown`

### 問題 3: ポート3001が使用中
```
Port 3001 is already in use
```

**解決方法:**
```powershell
# 使用中のプロセスを確認
netstat -ano | findstr :3001

# ポートを変更
echo "PORT=3002" | Out-File -Append .env
```

### 問題 4: メモリ不足エラー
```
Not enough memory available
```

**解決方法:**
1. Docker Desktopの設定でメモリを増やす
2. 他のアプリケーションを終了
3. Windowsを再起動

### 問題 5: WSL2統合の問題
```
WSL 2 is not enabled
```

**解決方法:**
1. Docker Desktop設定でWSL2統合を確認
2. WSL2を再起動: `wsl --shutdown`
3. Docker Desktopを再起動

## パフォーマンス最適化

### 1. Docker Desktopの設定最適化
- Memory: 6-8GB（システムRAMの75%以下）
- CPU: 利用可能なコア数の75%
- Disk image size: 十分な容量を確保

### 2. WSL2の最適化
`.wslconfig`ファイルをユーザーフォルダに作成:
```ini
[wsl2]
memory=6GB
processors=4
swap=2GB
```

### 3. Windowsの設定
- 仮想化支援機能（VT-x/AMD-V）を有効化
- Hyper-Vを無効化（Docker DesktopのWSL2モード使用時）

## データの管理

### バックアップ
```powershell
# データベースをバックアップ
.\run.ps1 backup

# バックアップファイルは backups\ フォルダに保存されます
```

### 復元
```powershell
# PowerShell版でのみ利用可能
.\run.ps1 restore
```

### データの場所
- SQLiteデータベース: Dockerボリューム `mtgcubes-data`
- バックアップファイル: `docker\backups\` フォルダ

## セキュリティとネットワーク

### ファイアウォール設定
- Windows Defenderでポート3001を許可（ローカルネットワークアクセス時）

### ネットワークアクセス
- デフォルトは localhost:3001 のみ
- 他のデバイスからアクセスする場合は設定変更が必要

## サポートとトラブルシューティング

### ログの確認
```powershell
# アプリケーションログ
.\run.ps1 logs

# Dockerシステムログ
docker system events

# Windows イベントログ
Get-WinEvent -LogName Application | Where-Object {$_.Source -eq "Docker Desktop"}
```

### システム情報の収集
```powershell
# Docker情報
docker version
docker system info

# WSL情報
wsl --status
wsl --list --verbose

# システム情報
systeminfo | findstr "OS\|Memory\|Processor"
```

### 完全リセット手順
```powershell
# 1. アプリケーションの完全停止
.\run.ps1 clean

# 2. Docker システムの清理
docker system prune -a --volumes

# 3. Docker Desktop再起動
# 4. WSL2再起動
wsl --shutdown
```

問題が解決しない場合は、プロジェクトのIssueページで報告してください。
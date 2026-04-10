# Portfolio Homepage

シンプルなミニマルデザインのポートフォリオサイト。日本語・英語切替対応、ブラウザ上でコンテンツを編集できる管理者モード付き。

**本番URL**: https://homepage-portfolio-2.vercel.app

## 機能

- **公開ページ**: Profile / Works（カテゴリフィルター付き）/ Schedule
- **言語切替**: 日本語・英語
- **管理者モード**: `/admin/login` からログインしてブラウザ上でコンテンツを編集
- **画像アップロード**: PC・スマホからアップロード可能（JPEG / PNG / GIF / WebP、最大10MB）

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router, TypeScript)
- **スタイル**: Tailwind CSS
- **認証**: JWT（`jose`）、httpOnly Cookie
- **ストレージ**: ローカル開発は `fs`、本番は Vercel Blob
- **デプロイ**: Vercel

## ローカル開発

```bash
npm install
cp .env.local.example .env.local  # 環境変数を設定
npm run dev
```

`http://localhost:3000` で起動します。

### 環境変数

`.env.local.example` を参考に `.env.local` を作成してください。

| 変数名 | 説明 |
|--------|------|
| `ADMIN_USERNAME` | 管理者ユーザー名 |
| `ADMIN_PASSWORD` | 管理者パスワード |
| `JWT_SECRET` | JWT署名キー（`openssl rand -base64 32` で生成） |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob トークン（本番のみ必要） |

## 管理者モード

1. `/admin/login` にアクセス
2. 設定したユーザー名・パスワードでログイン
3. 各セクション（Profile / Works / Schedule）を編集・保存

## Vercel デプロイ

1. Vercel ダッシュボードでプロジェクトを作成し、GitHub リポジトリを連携
2. 環境変数（`ADMIN_USERNAME`、`ADMIN_PASSWORD`、`JWT_SECRET`）を設定
3. **Storage** タブで Vercel Blob を追加（`BLOB_READ_WRITE_TOKEN` が自動設定される）
4. `main` ブランチへの push で自動デプロイ

## プロジェクト構成

```
app/
├── (public)/          # 公開ページ（Navigation付きレイアウト）
│   ├── page.tsx       # トップ（Profile）
│   ├── works/         # Works一覧
│   └── schedule/      # Schedule一覧
└── admin/             # 管理者ページ
    └── login/         # ログイン
components/
├── admin/             # 管理者用エディタコンポーネント
└── ...
data/                  # JSONデータ（ローカル開発用）
lib/
├── auth.ts            # JWT認証
├── data.ts            # データ読み書き（fs / Vercel Blob）
├── i18n.ts            # 言語取得（サーバー用）
├── t.ts               # 翻訳ヘルパー（クライアント用）
└── types.ts           # 型定義
proxy.ts               # 認証ガード（Next.js 16 Middleware）
```

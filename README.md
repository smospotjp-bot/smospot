# SmoSpot 🚬

GPSで現在地周辺の**喫煙所・喫煙可能な飲食店**を検索できるモバイルファーストWebアプリ。

## 技術スタック

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS（ブランドカラー `#2D6A4F`）
- Google Maps JavaScript API + Places API (New)
- Supabase（ユーザー投稿の保存）

## 機能

1. **現在地検索** — GPSで現在地を取得し、周辺の喫煙所をPlaces APIで検索
2. **地図表示** — Googleマップ（高さ40vh）にピン表示。喫煙所／喫煙可能店／閉鎖で色分け
3. **リスト表示** — 店名・距離・喫煙可否バッジ・最終確認日時
4. **ユーザー投稿** — 喫煙可否・閉鎖報告をSupabaseに保存（投稿者IPはサーバー側で記録）
5. **広告枠** — リスト内に4件ごとにAdSense用の枠を配置

## セットアップ

```bash
npm install
npm run dev   # http://localhost:3000
```

### 環境変数（`.env.local`）

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Supabase

`supabase/schema.sql` をSupabaseのSQL Editorで実行してテーブルとRLSポリシーを作成。

### Google Cloud

以下を有効化してください:
- Maps JavaScript API
- Places API (New)
- Geocoding API（キーワード検索用）

## ディレクトリ構成

```
app/
  layout.tsx          ルートレイアウト
  page.tsx            メイン画面（状態管理・検索フロー）
  api/reports/route.ts  投稿の保存／取得（IP記録）
components/            UIコンポーネント
lib/
  maps.ts             Maps JS APIローダー（シングルトン）
  places.ts           Places (New) テキスト検索
  reports.ts          Supabaseの投稿マージ
  distance.ts         Haversine距離計算
  supabase.ts         Supabaseクライアント
```

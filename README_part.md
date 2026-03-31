## 汎用的・再利用可能な機能リスト

本システムで実装された汎用的な機能は、他のプロジェクトでも再利用可能です。

### 認証・ユーザー管理関連

| 機能 | 実装場所 | 説明 |
|------|----------|------|
| メール認証付きログイン | [`src/app/api/auth/verify/route.ts`](src/app/api/auth/verify/route.ts:1) | メールアドレス確認用のトークン発行・検証 |
| パスワードリセット | [`src/app/api/auth/password-reset/route.ts`](src/app/api/auth/password-reset/route.ts:1) | パスワード再設定用メール送信・リセット処理 |
| ユーザー登録 | [`src/app/api/auth/signup/route.ts`](src/app/api/auth/signup/route.ts:1) | 新規ユーザー登録（メール認証付き） |
| メール送信共通関数 | [`src/lib/mail.ts`](src/lib/mail.ts:8) | Resend API を使用したメール送信（開発環境ではコンソール出力） |
| 管理者判定ユーティリティ | [`src/lib/user.ts`](src/lib/user.ts:7) | セッションまたはメールアドレスから管理者権限を判定 |
| Google OAuth 認証 | [`src/auth.ts`](src/auth.ts:26) | NextAuth を使用した Google 認証連携 |
| メールアドレス・パスワード認証 | [`src/auth.ts`](src/auth.ts:30) | クレデンシャルプロバイダーによる認証 |

### データ操作・サービス層

| 機能 | 実装場所 | 説明 |
|------|----------|------|
| 履歴保存機能 | [`src/service/history-service.ts`](src/service/history-service.ts:4) | 依頼・報告の変更前にデータを保存する履歴管理 |
| 依頼 CRUD | [`src/service/request-service.ts`](src/service/request-service.ts:42) | 依頼の作成・更新・取得・削除 |
| 報告 CRUD | [`src/service/report-service.ts`](src/service/report-service.ts:221) | 報告の作成・更新・取得・削除 |
| コメント CRUD | [`src/service/comment-service.ts`](src/service/comment-service.ts:1) | コメントの作成・更新・削除・取得 |
| ユーザープロフィール取得 | [`src/service/user-service.ts`](src/service/user-service.ts:1) | ユーザー情報の取得・更新 |
| Twitter 投稿機能 | [`src/service/twitter-service.ts`](src/service/twitter-service.ts:74) | 依頼を Twitter に自動投稿 |

### ユーティリティ・共通コンポーネント

| 機能 | 実装場所 | 説明 |
|------|----------|------|
| Markdown パース | [`src/lib/markdown.ts`](src/lib/markdown.ts:6) | Markdown の `##` セクションを抽出してカード表示用に変換 |
| Markdown 表示コンポーネント | [`src/components/ui/markdown.tsx`](src/components/ui/markdown.tsx:1) | Markdown を HTML としてレンダリング |
| 日付フォーマット | [`src/lib/date.ts`](src/lib/date.ts:1) | 日付のローカライズ・フォーマット |
| ユーザーツールチップ | [`src/components/organize/user_tooltip.tsx`](src/components/organize/user_tooltip.tsx:1) | ユーザー情報をホバーで表示 |
| 汎用ダイアログ | [`src/components/ui/dialog.tsx`](src/components/ui/dialog.tsx:1) | shadcn/ui のダイアログコンポーネント |
| 汎用シート | [`src/components/ui/sheet.tsx`](src/components/ui/sheet.tsx:1) | shadcn/ui のサイドシートコンポーネント |
| 汎用ドラワー | [`src/components/ui/drawer.tsx`](src/components/ui/drawer.tsx:1) | shadcn/ui のドラワーコンポーネント |

### API・インフラ連携

| 機能 | 実装場所 | 説明 |
|------|----------|------|
| クロノジョブ（Cron） | [`src/app/api/cron/tweet/route.ts`](src/app/api/cron/tweet/route.ts:1) | GitHub Actions から呼び出される定期実行エンドポイント |
| ヘルプコンテンツ API | [`src/app/api/help/[slug]/route.ts`](src/app/api/help/[slug]/route.ts:1) | Markdown ヘルプファイルを動的に提供 |
| Resend メール API 連携 | [`src/lib/mail.ts`](src/lib/mail.ts:3) | 開発/本番環境対応のメール送信 |
| Turso (libSQL) 接続 | [`src/lib/db.ts`](src/lib/db.ts:1) | SQLite 互換のデータベース接続・クエリ実行 |

### UI コンポーネント（shadcn/ui ベース）

| コンポーネント | 実装場所 |
|---------------|----------|
| Button | [`src/components/ui/button.tsx`](src/components/ui/button.tsx:1) |
| Card | [`src/components/ui/card.tsx`](src/components/ui/card.tsx:1) |
| Toast | [`src/components/ui/toast.tsx`](src/components/ui/toast.tsx:1) |

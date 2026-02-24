# 社会保険料計算ツール

2025年度（令和7年度）対応の日本の社会保険料計算ツールです。
月額給与・年齢・都道府県を入力するだけで、各種社会保険料と手取り見込み額を自動計算します。

## 機能

- **健康保険料**：都道府県別の協会けんぽ料率（2025年度）で計算
- **介護保険料**：40歳以上の場合に自動加算（料率 1.60%）
- **厚生年金保険料**：正社員の場合に計算（料率 18.3%）
- **雇用保険料**：雇用形態に応じて計算
- **賞与の保険料計算**：標準賞与額に基づく計算
- **手取り見込み額の表示**（社会保険料控除後の概算）
- **AI解説機能**：簡潔な解説・詳しい解説の2種類
- **URLシェア機能**：入力内容をURLでシェア可能

## セットアップ

### 必要な環境

- Node.js 18以上
- npm または yarn

### 1. リポジトリのクローン

```bash
git clone <your-repo-url>
cd shakaihoken-keisan
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env.local.example` をコピーして `.env.local` を作成し、APIキーを設定します。

```bash
cp .env.local.example .env.local
```

`.env.local` を編集：

```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

> **APIキーの取得方法**
> [Anthropic Console](https://console.anthropic.com/) にアクセスし、APIキーを発行してください。

### 4. ローカル開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## Vercelへのデプロイ

### 1. GitHubにプッシュ

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Vercelでプロジェクトをインポート

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. **「New Project」** をクリック
3. GitHubリポジトリを選択してインポート
4. **Application Preset（Framework Preset）** で **「Next.js」** を選択
5. **「Deploy」** をクリック

### 3. 環境変数の設定（Vercel）

デプロイ後、Vercelダッシュボードで環境変数を設定します：

1. プロジェクトの **「Settings」** → **「Environment Variables」** を開く
2. 以下の環境変数を追加：

| 変数名 | 値 |
|--------|-----|
| `ANTHROPIC_API_KEY` | Anthropicのシークレットキー |

3. **「Save」** して再デプロイ

## 使い方

1. **月額給与**を入力（例：300,000円）
2. **年齢**を入力（40歳以上は介護保険料が追加されます）
3. **都道府県**を選択（勤務地の都道府県）
4. **雇用形態**を選択（正社員 or パート・アルバイト）
5. **賞与額**を入力（任意）
6. **「計算する」** ボタンをクリック
7. 計算結果が右側に表示されます
8. **「URLをシェア」** ボタンで入力内容をURLとして共有できます

## 技術スタック

- **フレームワーク**：[Next.js 15](https://nextjs.org/) (App Router)
- **言語**：TypeScript
- **スタイル**：Tailwind CSS
- **フォーム管理**：React Hook Form
- **AI**：[Anthropic SDK](https://github.com/anthropics/anthropic-sdk-typescript) (Claude Haiku / Sonnet)

## 計算根拠

- **健康保険料率**：協会けんぽ 2025年度（令和7年度）都道府県別料率
- **介護保険料率**：1.60%（2025年度）
- **厚生年金保険料率**：18.3%
- **雇用保険料率**：労働者 0.6% / 事業主 0.95%（一般事業）
- **標準報酬月額**：実際の等級区分テーブルに基づく計算

> 本ツールの計算結果は参考値です。正確な保険料は所轄の年金事務所・健康保険組合にご確認ください。

## ライセンス

MIT

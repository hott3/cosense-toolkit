# cosense-toolkit

> Scrapbox (Cosense) を最高に快適な思考・執筆環境にするための統合ツールキット（UserCSS / UserScript / 拡張基盤）

[![Deploy to GitHub Pages](https://github.com/hott3/cosense-toolkit/actions/workflows/deploy.yml/badge.svg)](https://github.com/hott3/cosense-toolkit/actions/workflows/deploy.yml)

---

## 概要

`cosense-toolkit` は、Cosense（Scrapbox）を「直感的な思考をどんどん形にできるノート」へと進化させるためのモノレポです。
光学ガラス（Pure Optical Glass）のデザインシステム、動的テーマスイッチャー、表面張力リップル演出、そして将来の Chrome 拡張機能やモバイル向けクイック入力・Agent Skills までを unified に管理・配信します。

---

## 全体構成・配信の仕組み

`scrapbox.io` の Content Security Policy (CSP) により外部ドメイン（`github.io` 等）からの CSS / JS 読み込みはブロックされるため、ビルド成果物を **公開 Cosense プロジェクト（[`/cosense-toolkit`](https://scrapbox.io/cosense-toolkit/)）** に同期し、各プロジェクトからは同一ドメイン（`/api/code/cosense-toolkit/...`）として読み込む構成を採用しています。

```mermaid
flowchart LR
  subgraph GitHub["GitHub (hott3/cosense-toolkit)"]
    Src["ソースコード (packages/themes, userscripts)"]
    Build["ビルド (pnpm build -> dist/)"]
    Pages["GitHub Pages (成果物公開)"]
    Src --> Build --> Pages
  end

  subgraph PublicPJ["公開 Cosense (/cosense-toolkit)"]
    ThemePages["テーマページ群 (Theme-Pure-Optical-Glass 等)"]
    ScriptPage["スクリプトページ (Cosense-Toolkit-Script)"]
  end

  subgraph UserPJ["あなたの Cosense 環境"]
    Settings["対象 PJ の settings (code:style.css)"]
    UserPage["ユーザーページ (code:script.js)"]
  end

  Build -.->|"書き写し / 同期 (CSP 回避)"| ThemePages
  Build -.->|"書き写し / 同期 (CSP 回避)"| ScriptPage
  ThemePages -->|"同一オリジン ('self') で @import"| Settings
  ScriptPage -->|"同一オリジン ('self') で import"| UserPage
```

---

## ディレクトリ構成

```text
cosense-toolkit/
├── packages/
│   ├── themes/               # UserCSS テーマ群 (Pure Optical Glass, Daylight, Clean)
│   │   ├── src/
│   │   └── scripts/build.mjs
│   └── userscripts/          # TypeScript 製 UserScript (ドック・テーマ切替・リップル)
│       ├── src/
│       └── scripts/build.mjs
├── apps/                     # （将来拡張）Chrome 拡張機能 / モバイル PWA
├── skills/                   # （将来拡張）Scrapbox 連携 Agent Skills
├── dist/                     # GitHub Pages 配信成果物 (自動ビルド)
│   ├── themes/
│   │   ├── index.json        # テーマ一覧マニフェスト
│   │   └── <theme-id>/style.css
│   └── userscripts/
│       ├── script.js
│       └── script.min.js
├── mise.toml                 # Node 24 + pnpm 管理
├── pnpm-workspace.yaml
└── README.md
```

---

## 収録テーマ

1. **Pure Optical Glass（Night / Default）**
   - 深夜の漆黒（`#04080F`）と極薄ガラス板（透過率ゼロ塗りの屈折枠・シャンパンゴールド文字）。
   - 3層の流動ライトプールと、カード押下時の表面張力リップル（弾性変形）を搭載。
2. **Frosted Daylight（Day / Light）**
   - 昼光を浴びたフロストガラス（シルキーパール `#EFF4FA`、スカイブルー・アンバーの屈折光）。
3. **Modern Clean（Classic）**
   - 視覚効果をオフにし、白背景と最小限の枠線でテキストに集中できるクラシックテーマ。

---

## Scrapbox への導入方法

### 1. テーマの読み込み (`settings`)
プロジェクトの `settings` ページに以下を記載します（初期テーマとして Pure Optical Glass を読み込む場合）：

```css
/* Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Default Theme: Pure Optical Glass (公開 Cosense プロジェクト経由) */
@import url('/api/code/cosense-toolkit/Theme-Pure-Optical-Glass/style.css');
```

### 2. UserScript の読み込み（ユーザーページ）
ご自身のユーザーページ（例: `hott3`）の `code:script.js` に以下を記載します：

```javascript
import '/api/code/cosense-toolkit/Cosense-Toolkit-Script/script.js';
```

読み込むと画面右下に **Optical Lens ドック** が常駐し、パレットからいつでも瞬時にテーマを切り替えられるようになります（設定は `localStorage` に保持されます）。

---

## ローカル開発手順

ランタイムとパッケージ管理には **[mise](https://mise.jdx.dev/)** と **pnpm** を使用します。

```bash
# 1. 依存ツールの導入 (Node 24 & pnpm)
mise install

# 2. パッケージ依存のインストール
pnpm install

# 3. ビルド (dist/ に CSS と JS を一括生成)
mise run build
# または
pnpm build

# 4. 型チェック
mise run typecheck

# 5. 開発監視モード
mise run dev
```

---

## 今後のロードマップ

- [x] モノレポ構造の構築 (`mise` + `pnpm workspaces`)
- [x] テーマ 3 種（Night / Day / Classic）のパッケージ化
- [x] TypeScript 版 UserScript（ドック・テーマ切替・表面張力リップル）の実装
- [x] GitHub Pages 自動配信ワークフローの構築
- [ ] モバイル入力最適化（Quick Capture PWA / ショートカット連携）
- [ ] 自作 Chrome 拡張機能（Web ページのワンクリック Scrapbox 転送）
- [ ] 直感的な思考・音声メモを自動で構造化する Agent Skills

---

## License

[MIT License](./LICENSE) © hott3

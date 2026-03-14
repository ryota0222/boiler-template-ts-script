# boiler-template-ts-script

TypeScript スクリプト開発用のボイラープレートテンプレート。

## 必要なツール

| ツール  | バージョン | 備考                 |
| ------- | ---------- | -------------------- |
| mise    | 最新       | バージョン管理ツール |
| Node.js | 22.x       | `.mise.toml` で管理  |
| npm     | 10.x       | Node.js に同梱       |

## セットアップ

### 1. Node.js のインストール

```bash
mise install
```

### 2. パッケージのインストール

```bash
npm install
```

### 3. Git Hooks のインストール

```bash
npx lefthook install
```

### 4. ビルド

```bash
npm run build
```

## テストの実施方法

### 単体テスト

```bash
npm test
```

### カバレッジ付きテスト

```bash
npm run test:coverage
```

## 開発モード（TypeScript 直接実行）

```bash
npm run dev
```

## スクリプト一覧

| コマンド                | 説明                       |
| ----------------------- | -------------------------- |
| `npm run build`         | tsup でビルド              |
| `npm run typecheck`     | 型チェック                 |
| `npm run lint`          | ESLint 実行                |
| `npm run format`        | Prettier チェック          |
| `npm run format:fix`    | Prettier 自動修正          |
| `npm run test`          | テスト実行                 |
| `npm run test:watch`    | テスト (watch モード)      |
| `npm run test:coverage` | カバレッジ付きテスト       |
| `npm run knip`          | 未使用コード検出           |
| `npm run depcruise`     | 依存ルールチェック         |
| `npm run dev`           | tsx で TypeScript 直接実行 |

## ファイル構成

```text
.
├── src/
│   ├── index.ts              # CLI エントリーポイント
│   ├── entities/              # 型定義・zod スキーマ
│   └── libs/                  # 処理の実装（機能ごとにサブディレクトリ）
├── docs/                      # 仕様書
├── dist/                      # コンパイル済み JavaScript
├── .claude/                   # Claude Code 設定・ルール
├── .dependency-cruiser.cjs    # 依存ルール設定
├── lefthook.yml               # Git Hooks 設定
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
├── eslint.config.js
├── .prettierrc
├── .prettierignore
├── .mise.toml                 # mise バージョン管理設定
└── README.md
```

## Git Hooks

| フック     | チェック内容                             |
| ---------- | ---------------------------------------- |
| pre-commit | lint, format, typecheck, knip, depcruise |
| commit-msg | commitlint (Conventional Commits)        |
| pre-push   | vitest                                   |

## 技術スタック

- **Runtime**: Node.js v22+ (ESM)
- **Language**: TypeScript 5.x (strict mode)
- **Build**: tsup
- **Test**: Vitest + v8 coverage
- **Lint**: ESLint (strict + stylistic + perfectionist)
- **Format**: Prettier
- **Git Hooks**: lefthook + commitlint
- **Static Analysis**: knip (未使用コード検出) + dependency-cruiser (依存ルール)
- **AI**: Claude Code (rules, hooks, settings)

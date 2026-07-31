# boiler-template-ts-script

TypeScript スクリプト開発用のボイラープレートテンプレート。

## 必要なツール

| ツール  | バージョン | 備考                    |
| ------- | ---------- | ----------------------- |
| mise    | 最新       | バージョン管理ツール    |
| Node.js | 24.x       | `.mise.toml` で管理     |
| pnpm    | 11.x       | `packageManager` で管理 |

## セットアップ

### 1. Node.js のインストール

```bash
mise install
```

### 2. パッケージのインストール

```bash
pnpm install
```

### 3. Git Hooks のインストール

```bash
pnpm exec lefthook install
```

### 4. ビルド

```bash
pnpm run build
```

## テストの実施方法

### 単体テスト

```bash
pnpm test
```

### カバレッジ付きテスト

```bash
pnpm run test:coverage
```

## 開発モード（TypeScript 直接実行）

```bash
pnpm run dev
```

## スクリプト一覧

| コマンド                 | 説明                       |
| ------------------------ | -------------------------- |
| `pnpm run build`         | tsup でビルド              |
| `pnpm run typecheck`     | 型チェック                 |
| `pnpm run lint`          | ESLint 実行                |
| `pnpm run format`        | Prettier チェック          |
| `pnpm run format:fix`    | Prettier 自動修正          |
| `pnpm run lint:sh`       | ShellCheck 実行            |
| `pnpm run format:sh`     | shfmt フォーマットチェック |
| `pnpm run format:sh:fix` | shfmt 自動修正             |
| `pnpm run test`          | テスト実行                 |
| `pnpm run test:watch`    | テスト (watch モード)      |
| `pnpm run test:coverage` | カバレッジ付きテスト       |
| `pnpm run knip`          | 未使用コード検出           |
| `pnpm run depcruise`     | 依存ルールチェック         |
| `pnpm run dev`           | tsx で TypeScript 直接実行 |

## ファイル構成

```text
.
├── src/
│   ├── index.ts             # CLI エントリーポイント
│   ├── entities/            # 型定義・zod スキーマ
│   ├── gateways/            # 外部データソースとの I/O
│   ├── controllers/         # 入力を受け取り Usecase を呼び出す
│   ├── usecases/            # ビジネスロジック
│   │   └── <domain>/
│   │       ├── gateways/    # gateway のポート型定義のみ（実装は含まない）
│   │       └── presenters/  # presenter のポート型定義のみ（実装は含まない）
│   ├── presenters/          # Usecase の結果を出力形式に変換
│   └── utilities/           # 各層から利用可能な横断的ユーティリティ
├── docs/                      # 仕様書
├── dist/                      # コンパイル済み JavaScript
├── .claude/                   # Claude Code 設定・ルール
├── .dependency-cruiser.cjs    # 依存ルール設定
├── lefthook.yaml              # Git Hooks 設定
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
├── eslint.config.ts
├── .prettierrc
├── .prettierignore
├── .mise.toml                 # mise バージョン管理設定
└── README.md
```

## Git Hooks

| フック     | チェック内容                                                                                    |
| ---------- | ----------------------------------------------------------------------------------------------- |
| pre-commit | lint, format, typecheck, knip, depcruise, markdownlint, actionlint, shellcheck, shfmt, gitleaks |
| commit-msg | commitlint (Conventional Commits)                                                               |
| pre-push   | vitest                                                                                          |

## 技術スタック

- **Runtime**: Node.js v24+ (ESM)
- **Language**: TypeScript 5.x (strict mode)
- **Build**: tsup
- **Test**: Vitest + v8 coverage
- **Lint**: ESLint (strict + stylistic + perfectionist)
- **Format**: Prettier
- **Git Hooks**: lefthook + commitlint
- **Static Analysis**: knip (未使用コード検出) + dependency-cruiser (依存ルール)
- **AI**: Claude Code (rules, hooks, settings)

## オプション

### Effect

複雑なエラーハンドリング・依存性注入・並行処理が必要な場合に検討。

```bash
pnpm add effect
```

- 型安全なエラー（`Effect<Success, Error, Requirements>`）
- `Context` / `Layer` による依存性注入
- `Effect.Schema` で Zod を置き換え可能
- 全面採用が前提（async/await との混在は非推奨）
- 公式: [effect.website](https://effect.website/)

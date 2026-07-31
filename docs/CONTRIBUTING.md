# コントリビューションガイド

## ブランチ戦略

- `main` ブランチから作業ブランチを作成する
- ブランチ名は `feature/xxx`、`fix/xxx` のように型をプレフィックスにする

## 開発の進め方

### TDD（テスト駆動開発）

開発は TDD で行う。以下のサイクルを繰り返す。

1. 失敗するテストを書く
2. テストが通る最小限の実装を書く
3. テストが通ることを確認する
4. リファクタリングする

### Claude Code

Claude Code を使用する場合は VSCode を推奨する。プロジェクトに `.claude/rules/` と `.claude/skills/` が設定されており、VSCode 拡張機能と組み合わせることで最大限活用できる。

superpowers を用いて段階的に開発を行うこと。

- ブレインストーミング → 設計 → 実装計画 → 実装の順で進める
- 各ステップでレビューを挟む

## コミット

### コミットメッセージ

- [Conventional Commits](https://www.conventionalcommits.org/) に従う
- commitizen または Claude Code の `/commit` スキルを使用してコミットメッセージを作成する
- コミットメッセージは日本語で記述する
- commitlint によってフォーマットが検証される

### Git Hooks

lefthook により以下のフックが自動実行される。

| フック     | チェック内容                                                                                                                       |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| pre-commit | lint, format, typecheck, knip, depcruise, markdownlint, actionlint, shellcheck, shfmt, gitleaks, eslint-disable / v8 ignore の検出 |
| commit-msg | commitlint (Conventional Commits)                                                                                                  |
| pre-push   | vitest (カバレッジ 100%), gitleaks                                                                                                 |

`--no-verify` によるフックのスキップは禁止する。フックが失敗した場合は原因を修正すること。

## CI

pull request 作成時および `main` への push 時に GitHub Actions で全チェック（secretlint, gitleaks, lint, format, typecheck, knip, depcruise, markdownlint, actionlint, shellcheck, shfmt, test（カバレッジ計測付き）, build）が実行される。

## ドキュメント

ドキュメントは `docs/` ディレクトリに配置する。

# コントリビューションガイド

## ブランチ戦略

- `main` ブランチから作業ブランチを作成する
- ブランチ名は `feature/xxx`、`fix/xxx`、`chore/xxx` のように型をプレフィックスにする

## 開発の進め方

### TDD（テスト駆動開発）

開発は TDD で行う。以下のサイクルを繰り返す。

1. 失敗するテストを書く
2. テストが通る最小限の実装を書く
3. テストが通ることを確認する
4. リファクタリングする

### 段階的な開発

Claude Code を使用する場合は superpowers を用いて段階的に開発を行うこと。

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

| フック     | チェック内容                             |
| ---------- | ---------------------------------------- |
| pre-commit | lint, format, typecheck, knip, depcruise |
| commit-msg | commitlint (Conventional Commits)        |
| pre-push   | vitest                                   |

`--no-verify` によるフックのスキップは禁止する。フックが失敗した場合は原因を修正すること。

## CI

push 時に GitHub Actions で全チェック（lint, format, typecheck, knip, depcruise, test, build）が実行される。

## ドキュメント

ドキュメントは `docs/` ディレクトリに配置する。

---
description: GitHub Actions ワークフローファイルの規約
paths: ['.github/workflows/*.yaml']
---

# GitHub Actions 規約

## ファイル拡張子

- `.yaml` を使用する（`.yml` は不可）

## ファイル名

- アクションベースの命名にする（動詞 + 名詞）
  - Good: `run-ci.yaml`, `deploy-production.yaml`, `check-lint.yaml`
  - Bad: `ci.yaml`, `production.yaml`, `lint.yaml`

## アクションのバージョン指定

- コミットIDでピン留めする（タグは不可）
- コメントでバージョンタグを併記する

```yaml
# Good
- uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4

# Bad
- uses: actions/checkout@v4
```

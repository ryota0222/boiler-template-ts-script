# Architecture Decision Records (ADR)

ADR は、プロジェクトで行った重要な設計・技術的な意思決定を記録するためのドキュメントです。
「なぜその選択をしたのか」を後から振り返れるようにすることを目的としています。

## ADR の作成方法

1. [template.md](template.md) をコピーする
2. ファイル名を `NNNN-タイトル.md` の形式でつける（例: `0001-use-tsup-for-bundling.md`）
3. テンプレートの各セクションを埋める
4. 日本語で記述する

## ファイル命名規則

```text
NNNN-title-with-dashes.md
```

- `NNNN`: 連番（0001 から開始）
- `title-with-dashes`: 決定内容を表す短いタイトル（英語・ケバブケース）

## ステータスの種類

| ステータス | 意味                         |
| ---------- | ---------------------------- |
| Proposed   | 提案中（まだ確定していない） |
| Accepted   | 採用済み（現在有効）         |
| Deprecated | 非推奨（もう従わなくてよい） |
| Superseded | 別の ADR に置き換え済み      |

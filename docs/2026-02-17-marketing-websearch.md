# Marketing Web Research - 設計メモ

**日付**: 2026-02-17
**目的**: マーケティング用途の情報収集Web検索機能を追加（検索→抽出→要約→根拠リンク→出力を一気通貫）

---

## 背景

ユーザーが自然文で「◯◯の最新トレンド調べて」「競合3社の特徴比較して」と依頼すると、
概要・重要ポイント・競合比較・引用元URL・次の問い・フック案を返す。

---

## 仕様

### 入力（skill）

| フィールド    | 型       | 必須 | 説明                             |
| ------------- | -------- | ---- | -------------------------------- |
| topic         | string   | ✅   | 調査トピック                     |
| purpose       | string   | -    | 調査目的（比較/トレンド/相場等） |
| locale        | string   | -    | `ja` or `en`（デフォルト `ja`）  |
| maxSources    | number   | -    | 最大ソース数（デフォルト 10）    |
| constraints   | string   | -    | 追加制約（任意テキスト）         |

### 出力（JSON）

```json
{
  "summary": "概要（3〜7行）",
  "key_points": ["重要ポイント1", "..."],
  "comparisons": [{"name": "企業A", "notes": ["特徴1", "特徴2"]}],
  "sources": [{"title": "記事名", "url": "https://...", "published_at": "2026-01-15", "why_reliable": "一次情報"}],
  "next_questions": ["深掘りすべき問い1", "..."],
  "hooks": ["X投稿フック案1", "..."]
}
```

### 検索プロバイダ（差し替え可能）

- **DuckDuckGo**（キー無し・デフォルト）: HTML スクレイピング
- **SerpAPI**（キーあり・オプション）: REST API

### 本文抽出

- HTML → テキスト変換（ルールベース: script/style/nav 除去）
- 広告・ナビゲーション要素のフィルタリング

---

## 影響範囲（変更ファイル一覧）

すべて **新規追加** のみ:

- `extensions/websearch/` — Web検索エクステンション
  - `index.ts` — プラグイン登録
  - `package.json` — パッケージ定義
  - `src/types.ts` — 型定義
  - `src/providers/duckduckgo.ts` — DuckDuckGo プロバイダ
  - `src/providers/serpapi.ts` — SerpAPI プロバイダ
  - `src/extract/html-to-text.ts` — HTML本文抽出
  - `src/websearch-tool.ts` — ツール本体
  - `README.md`
- `skills/custom-marketing-web-research/` — マーケ調査スキル
  - `SKILL.md` — スキル定義
  - `examples.md` — 使用例
- `tests/websearch.provider.test.ts` — プロバイダテスト
- `tests/marketing.research.skill.test.ts` — スキルテスト
- `docs/2026-02-17-marketing-websearch.md` — 本ファイル
- `.env.example` — 設定キー追記

---

## 動作確認手順

```bash
pnpm test
npx tsx tests/websearch.provider.test.ts
npx tsx tests/marketing.research.skill.test.ts
```

---

## 既知の制約 / TODO

- DuckDuckGo HTML スクレイピングは構造変更で壊れる可能性あり
- robots.txt チェックは未実装（User-Agent 明示のみ）
- 本文抽出は軽量ルールベース（readability ライブラリ導入は将来検討）
- レート制御は基本的な遅延のみ（本格的なレートリミッタは将来課題）

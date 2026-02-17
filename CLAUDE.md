OpenClaw Customization Rules (Skills-First / Upstream-Safe)

このリポジトリは OpenClaw のカスタマイズを目的とする。
最重要KPIは **「upstream追従で壊れない」「差分が小さい」「再現性がある」**。

拡張は原則 **skills/（追加のみ）** と **plugins/extensions/** に閉じ込める。

---

## 0. 絶対ルール（最優先）

1. **コア改変は原則禁止**。変更は `skills/`（追加のみ）または `plugins/` / `extensions/` で完結させる。
2. upstream 取り込みを容易にするため、**差分は最小**・**変更範囲は局所化**。
3. 実装は必ず **設計メモ（docs/）→実装→テスト→実行確認** の順で進める。
4. 例外的にコア改変が必要な場合は、まず **提案**（理由・代替案・最小変更案）を `docs/` に書いてから着手する。
5. **秘密情報（APIキー等）はコミット禁止**。`.env` は参照のみで、サンプルは `.env.example` に書く。

---

## 1. 変更してよい場所 / 原則触ってはいけない場所

### ✅ 変更してよい（通常の作業範囲）

* `skills/**`（**追加のみ**：新規ディレクトリ・新規ファイルの追加はOK）
* `plugins/**`（外部連携・実行系・ツール接続）
* `extensions/**`（存在する場合：同上）
* `docs/**`
* `tests/**`
* `scripts/**`（開発補助）
* `README*`, `RULE.md`, `AGENTS.md`（運用ルール）

### ⚠️ 原則触ってはいけない（変更するなら事前提案が必要）

* `src/core/**` / `core/**` / `packages/core/**` など「OpenClawの核」
* 既存の重要な初期化・起動フロー・CLI本体
* 既存のプロトコル・I/O・認証部分
* `skills/` 配下の upstream 由来の既存スキル（編集禁止：必要なら提案→最小修正）

---

## 2. Skills運用ルール（最重要）

### 2.1 skills/ は「追加専用」

* `skills/` では **新規スキル追加のみ許可**。
* 既存の upstream スキルの **編集・削除・移動は禁止**。
* 例外的に必要な場合は `docs/` に提案を書き、**最小差分**で行う。

### 2.2 命名規約（衝突回避）

upstreamとの衝突を避けるため、スキルディレクトリ名は必ず以下：

* `custom-<project>-<name>`

  * 例: `custom-buzztweet-hook-generator`
  * 例: `custom-buzztweet-viral-analyzer`

### 2.3 スキルの最低要件（必須ファイル）

各スキルは最低限、以下を含む（名称はプロジェクト仕様に合わせるが、意図は固定）：

* `skill.yaml`（または manifest 相当） … **必須**
* `system.md` … **必須**（人格・役割・禁止事項）
* `schema.json` … **必須**（入力の契約）
* `tool.(ts|py)` … 実行が必要なら必須（無いなら生成専用でも可）
* `examples.md` … 任意（few-shotが効く場合）

### 2.4 “skillsは頭脳 / extensionsは手足”

* **skills**：判断・推論・生成（例：バズ要因分析、フック生成、炎上回避）
* **plugins/extensions**：外部接続・実行（例：X API、DB、Notion、スケジューラ）
* skills から外部に触りたい場合は、**直接実装せず** plugin/extension のツールを呼ぶ（依存を薄く保つ）。

---

## 3. ブランチ運用（必須）

* `main` へ直接コミット禁止
* 作業ブランチは必ず `feat/*` `fix/*` `chore/*`

  * 例: `feat/custom-buzztweet-hook-generator`
  * 例: `fix/skill-manifest-validation`

---

## 4. 実装スタイル（差分最小のための原則）

### 4.1 Additive Only（追加で解決）

* 既存ファイルを書き換えるのではなく、**新規追加**で解決する。
* `skills/` は特に **追加のみ** を徹底する。

### 4.2 依存と共有

* 共通処理が必要なら `plugins/_shared/` に集約してOK。
* skills間での重い依存（共通lib化）は避け、必要なら plugin 側で提供する。

### 4.3 互換性

* Node / Python / ランタイム要件を勝手に上げない（必要なら `docs/` に提案）。
* 既存の設定ファイル形式・CLI引数は壊さない。

---

## 5. ドキュメント必須（docs/ に残す）

新規スキル追加・重要修正のたびに、以下を `docs/` に1ファイル作る：

* `docs/<YYYY-MM-DD>-<topic>.md`

  * 目的 / 背景
  * 仕様（入力・出力・例）
  * 影響範囲（変更ファイル一覧）
  * 動作確認手順（コマンド）
  * 既知の制約 / TODO

---

## 6. テスト & 実行確認（必須）

### 6.1 変更ごとに最低限

* **最低1本**テスト追加（unit または integration）

  * 例: `schema.json` の整合性
  * 例: `skill.yaml` の必須項目検証
  * 例: tool のスモークテスト

### 6.2 実行コマンドの優先順位

1. `npm test` / `pnpm test` / `pytest`
2. `npm run lint` / `npm run typecheck`
3. `npm run build`
4. 可能なら最小のE2E（例: ローカルで1回起動 → 期待ログ）

---

## 7. 設定の扱い（安全 & 再現性）

* 新しい設定は `openclaw.config.*`（存在する形式）に追加する（可能なら）。
* 設定は **デフォルト値** を必ず持たせる。
* `.env` を読む場合は、キー名を `docs/` と `.env.example` に書く。
* ログに秘密情報を出さない（トークン・Cookie・個人情報）。

---

## 8. ログ & エラー方針（運用で死なないため）

* 例外は握り潰さず、意味のあるメッセージで throw / return error。
* 重要処理には「開始」「成功」「失敗」をログ出しする。
* 外部API（Telegram/X/Discord等）は

  * rate limit
  * retry（指数バックオフ）
  * timeout
  * idempotency
    を考慮する。

---

## 9. upstream 追従を壊さないためのルール

* 既存ファイルの大規模リネーム・移動は禁止（どうしてもなら提案→最小）。
* 依存追加は最小。追加する場合は理由と代替案を `docs/` に残す。
* upstream更新で競合しやすい場所に変更を入れない。

  * 入れるなら、hook/adapter/plugin loader など一点に集中させる。

---

## 10. upstream取り込み時の作法（手順固定）

upstream を取り込む作業が発生したら：

1. `git fetch upstream`
2. 原則 `rebase upstream/main`（チーム運用なら merge でも可）
3. 競合が出たら **まず “編集ではなく追加で回避できないか”** を検討
4. 解消後、必ず

   * tests
   * build
   * 最小起動確認
5. 取り込み結果を `docs/` に一行でも残す（何が変わったか）

---

## 11. コミット規約（レビューしやすさ最優先）

* 1コミット = 1目的（混ぜない）
* コミットメッセージ例

  * `feat(skill): add custom-buzztweet-hook-generator`
  * `fix(plugin-loader): handle missing config`
  * `chore(docs): add setup notes`
* 大きめ変更は PR 前提で、説明を `docs/` に置く。

---

## 12. Claude Code の作業プロトコル（重要）

Claude Code は作業前に必ず以下を出力してから実装に入る（短くていい）：

* 目的（1行）
* 触るファイル一覧（変更範囲）
* 実行確認コマンド（最低1つ）

実装後は必ず：

* 変更点まとめ（3行以内）
* 実行確認結果（実行したコマンドと結果）
* TODO（残るなら）

---

## 13. 禁止事項（破るとupstream追従が死ぬ）

* コアの全面書き換え
* `skills/` 既存スキルの編集・削除・移動（原則禁止）
* 無計画な依存追加（特に巨大フレームワーク導入）
* 設定形式の破壊的変更
* 秘密情報のコミット
* テストなしの機能追加（最低1本は必須）

---

## 付録：推奨ディレクトリ構成

* `skills/`

  * `custom-<project>-<name>/`

    * `skill.yaml`
    * `system.md`
    * `schema.json`
    * `tool.(ts|py)`（必要なら）
    * `examples.md`（任意）
* `plugins/`

  * `plugin-<name>/`
  * `_shared/`
* `extensions/`（存在する場合）
* `docs/`
* `tests/`
* `scripts/`
* `.env.example`

---

不明点や例外が必要な場合は、必ず `docs/` に提案を書き、最小変更で合意できる案を採用する。

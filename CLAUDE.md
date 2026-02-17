# RULE.md — OpenClaw Customization Rules (for Claude Code)

このリポジトリは OpenClaw のカスタマイズ（拡張）を目的とする。
最重要KPIは「upstream追従で壊れない」「差分が小さい」「再現性がある」。

---

## 0. 絶対ルール（最優先）

1. **コア改変は原則禁止**。拡張は `plugins/`（または `extensions/`）に閉じ込める。
2. upstream の変更を取り込みやすくするため、**差分は最小**・**変更範囲は局所化**。
3. 何かを実装する前に、必ず **設計メモ（docs/）→実装→テスト→実行確認** の順で進める。
4. 例外的にコア改変が必要な場合は、まず **提案**（理由・代替案・最小変更案）を `docs/` に書いてから着手する。
5. **秘密情報（APIキー等）はコミット禁止**。`.env` は参照のみで、サンプルは `.env.example` に書く。

---

## 1. 変更してよい場所 / 原則触ってはいけない場所

### ✅ 変更してよい（通常の作業範囲）

* `plugins/**`
* `extensions/**`
* `docs/**`
* `tests/**`
* `scripts/**`
* `README*`, `RULE.md`, `AGENTS.md`

### ⚠️ 原則触ってはいけない

* `apps/**`（アプリ起動・エントリポイント）
* `packages/**`（共有ライブラリ/コアロジック）
* `src/**` の既存基盤処理
* 起動フロー / CLI本体 / 認証部分

---

## 2. ブランチ運用

* `main` へ直接コミット禁止
* `feat/*` `fix/*` `chore/*` のみ使用

---

## 3. Plugin First 原則

* 新機能は `plugins/<plugin-name>/` に完結させる
* コア変更は「追加のみ」
* 既存挙動を書き換えない

---

## 4. docs/ 必須

`docs/YYYY-MM-DD-topic.md`

* 目的
* 仕様
* 影響範囲
* 動作確認
* 制約

---

## 5. テスト必須

最低1テスト追加
実行コマンドを docs に記載

---

## 6. 設定ルール

* デフォルト値必須
* `.env.example` 更新
* 秘密情報ログ禁止

---

## 7. upstream追従を壊さない

* 大規模リネーム禁止
* 依存追加最小
* hookに集約

---

## 8. コミット規約

`feat(plugin-xxx): add feature`
`fix(loader): handle config`

---

## 最重要原則

> 成功条件は高品質コードではなく
> **永続的にアップデート追従できること**

---

# AGENTS.md — OpenClaw Multi-Agent Workflow

Claude Code を役割分担チームとして動作させる。

## フロー

Researcher → Architect → Safety → Implementer → Tester → Integrator → UpstreamGuard

---

## 共通出力形式

```
# Agent: <role>
## Summary

## FilesTouched

## Risks

## NextAgent
```

---

## Researcher

調査のみ、実装禁止

---

## Architect

最小変更設計
plugin優先

---

## Safety

破壊判定
NGならArchitectへ差し戻し

---

## Implementer

設計通り実装のみ
改善禁止

---

## Tester

最低1テスト
再現手順提示

---

## Integrator

起動確認
既存機能確認
plugin ON/OFF確認

---

## UpstreamGuard

将来競合評価

```
UpgradeRisk: LOW | MEDIUM | HIGH
MergeStrategy: rebase | isolate | patch
```

---

## 起動テンプレ

```
You are operating in AGENTS TEAM MODE.
Follow AGENTS.md strictly.
Start from Researcher.
Do NOT skip agents.
Goal: <task>
```

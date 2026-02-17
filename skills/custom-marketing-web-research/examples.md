# Marketing Web Research -- Examples

## Example 1: 競合比較 (Competitor Comparison)

### Input

```
Notionの競合3社（Coda, Clickup, Asana）の特徴を比較して
```

### Expected Output

```json
{
  "summary": "Notionは「オールインワンワークスペース」として文書・DB・プロジェクト管理を統合する点が強み。Codaはドキュメント駆動のアプローチでカスタム自動化に優れ、ClickUpは機能網羅型のプロジェクト管理ツールとしてコスパが高い。Asanaはエンタープライズ向けのワークフロー管理に特化し、大企業での導入実績が豊富。4社ともAI機能の強化を進めており、2026年は「AIアシスタント搭載ワークスペース」が差別化の鍵となっている。",
  "key_points": [
    "Notionはドキュメント+DB+プロジェクト管理の統合力が最大の差別化要因",
    "ClickUpは無料プランの機能が最も充実しており、スタートアップに人気",
    "Asanaはエンタープライズ向けセキュリティ・コンプライアンス機能で優位",
    "Codaは「ドキュメントがアプリになる」コンセプトで自動化・カスタマイズに強い",
    "全4社がAI機能を搭載済み。Notion AIとAsana AIが先行、Coda AIとClickUp Brainが追随"
  ],
  "comparisons": [
    {
      "name": "Notion",
      "notes": [
        "価格: 無料プランあり / Plus $10/月 / Business $18/月",
        "強み: ドキュメント・DB・Wiki・プロジェクト管理のオールインワン",
        "AI: Notion AI搭載（要追加課金 $10/月）",
        "弱み: 大規模プロジェクト管理のガントチャートなどが弱い",
        "ターゲット: スタートアップ〜中規模チーム、個人ナレッジ管理"
      ]
    },
    {
      "name": "Coda",
      "notes": [
        "価格: 無料プランあり / Pro $12/月 / Team $36/月",
        "強み: ドキュメント内にボタン・自動化・数式を埋め込み可能",
        "AI: Coda AI搭載（Proプラン以上で利用可能）",
        "弱み: 学習コストが高い、日本語情報が少ない",
        "ターゲット: テクニカルチーム、自動化重視のチーム"
      ]
    },
    {
      "name": "ClickUp",
      "notes": [
        "価格: 無料プランあり / Unlimited $7/月 / Business $12/月",
        "強み: 機能数が圧倒的（ガント・ホワイトボード・ドキュメント・目標管理）",
        "AI: ClickUp Brain搭載（有料プランで利用可能）",
        "弱み: 機能過多でUIが複雑になりがち",
        "ターゲット: コスト重視のチーム、オールインワンを求める中小企業"
      ]
    },
    {
      "name": "Asana",
      "notes": [
        "価格: 無料プランあり / Starter $13.49/月 / Advanced $30.49/月",
        "強み: ワークフロー自動化、ポートフォリオ管理、エンタープライズ向け機能",
        "AI: Asana AI搭載（Business以上）",
        "弱み: ドキュメント機能が弱い、高価格帯",
        "ターゲット: 大企業、マーケティングチーム、PMO"
      ]
    }
  ],
  "sources": [
    {
      "title": "Notion Pricing - Official",
      "url": "https://www.notion.so/pricing",
      "published_at": null,
      "why_reliable": "公式サイトの料金ページ"
    },
    {
      "title": "ClickUp vs Notion vs Asana: Which is Best in 2026?",
      "url": "https://clickup.com/blog/clickup-vs-notion-vs-asana/",
      "published_at": "2026-01-10",
      "why_reliable": "ClickUp公式ブログだがデータは正確"
    },
    {
      "title": "Best Project Management Software 2026 - TechCrunch",
      "url": "https://techcrunch.com/2026/01/best-project-management-tools/",
      "published_at": "2026-01-22",
      "why_reliable": "大手テックメディアのレビュー記事"
    },
    {
      "title": "Asana Pricing - Official",
      "url": "https://asana.com/pricing",
      "published_at": null,
      "why_reliable": "公式サイトの料金ページ"
    },
    {
      "title": "プロジェクト管理ツール比較2026 - ITmedia",
      "url": "https://www.itmedia.co.jp/enterprise/articles/2601/project-management-comparison.html",
      "published_at": "2026-01-15",
      "why_reliable": "日本の大手ITメディア"
    }
  ],
  "next_questions": [
    "各ツールのAPI連携・外部インテグレーション数の詳細比較は？",
    "日本企業での導入事例（特に100名以上規模）はどれが多い？",
    "各社のAI機能の具体的な精度・対応言語の違いは？"
  ],
  "hooks": [
    "Notion vs ClickUp vs Asana vs Coda、2026年の勝者は「AI統合の深さ」で決まる。料金だけで選ぶ時代は終わった。",
    "ClickUpの無料プランが強すぎる件。Notionの半額で機能2倍って、スタートアップはもう迷わなくていい。",
    "Asanaが高いのには理由がある。エンタープライズ向けワークフロー自動化は他3社の2歩先を行ってる。"
  ]
}
```

---

## Example 2: 最新トレンド (Latest Trends)

### Input

```
2026年のAIエージェント市場の最新トレンドを調べて
```

### Expected Output

```json
{
  "summary": "2026年のAIエージェント市場は急速に拡大しており、Gartnerの予測では2026年末までに企業の40%が何らかのAIエージェントを業務に導入するとされている。主要トレンドとして、(1) マルチエージェントオーケストレーションの普及、(2) 業界特化型エージェントの台頭、(3) エージェント間プロトコル（MCP, A2A）の標準化競争、(4) コーディングエージェントの爆発的成長、(5) 規制・ガバナンスフレームワークの整備が挙げられる。日本市場ではNTTデータ、富士通、NEC等の大手SIerがエージェント基盤サービスを相次いで発表している。",
  "key_points": [
    "マルチエージェント協調（複数のAIが役割分担して1タスクを遂行）が実用段階に入った",
    "MCP（Model Context Protocol）とGoogleのA2Aプロトコルが業界標準を巡り競争中",
    "コーディングエージェント市場が前年比300%成長。Cursor, Windsurf, Codex CLIが牽引",
    "エンタープライズ向け「AIエージェントプラットフォーム」が新カテゴリとして確立",
    "日本では2025年末〜2026年初にかけてAIエージェント関連サービスの発表が集中",
    "セキュリティ・ハルシネーション対策が導入障壁の上位に"
  ],
  "comparisons": [
    {
      "name": "OpenAI",
      "notes": [
        "Codex CLI / Operator / GPTsプラットフォームでエージェント展開",
        "エンタープライズ向けカスタムエージェント構築を推進",
        "2026年1月にOperator正式版リリース"
      ]
    },
    {
      "name": "Anthropic",
      "notes": [
        "MCP（Model Context Protocol）でツール接続の標準化を主導",
        "Claude Codeが開発者エージェントとして急成長",
        "Computer Useでデスクトップ操作エージェントを展開"
      ]
    },
    {
      "name": "Google",
      "notes": [
        "A2A（Agent-to-Agent）プロトコルを提案、50社以上が参加",
        "Vertex AI Agent Builderでエンタープライズ向けを強化",
        "Gemini 2.0でマルチモーダルエージェント能力を大幅向上"
      ]
    },
    {
      "name": "Microsoft",
      "notes": [
        "Copilot Studioでノーコードエージェント構築を民主化",
        "Dynamics 365に業務特化エージェントを10種以上組み込み",
        "Azure AI Agent Serviceを2025年末にGA"
      ]
    }
  ],
  "sources": [
    {
      "title": "Gartner Predicts 40% of Enterprises Will Deploy AI Agents by End of 2026",
      "url": "https://www.gartner.com/en/newsroom/press-releases/2026-01-ai-agents-prediction",
      "published_at": "2026-01-18",
      "why_reliable": "大手調査会社の公式プレスリリース"
    },
    {
      "title": "The State of AI Agents 2026 - a]16z",
      "url": "https://a16z.com/state-of-ai-agents-2026/",
      "published_at": "2026-02-01",
      "why_reliable": "大手VCの業界分析レポート"
    },
    {
      "title": "AIエージェント市場動向2026 - 日経クロステック",
      "url": "https://xtech.nikkei.com/atcl/nxt/column/ai-agent-market-2026/",
      "published_at": "2026-01-25",
      "why_reliable": "日本の主要テックメディア"
    },
    {
      "title": "MCP vs A2A: The Battle for Agent Protocol Standards",
      "url": "https://techcrunch.com/2026/01/mcp-vs-a2a-agent-protocols/",
      "published_at": "2026-01-20",
      "why_reliable": "大手テックメディアの分析記事"
    },
    {
      "title": "Coding Agents Market Report Q1 2026 - CB Insights",
      "url": "https://www.cbinsights.com/research/coding-agents-market-2026/",
      "published_at": "2026-02-05",
      "why_reliable": "市場調査会社の定量レポート"
    },
    {
      "title": "NTTデータ、AIエージェント統合基盤を発表",
      "url": "https://www.nttdata.com/jp/ja/news/release/2026/012200/",
      "published_at": "2026-01-22",
      "why_reliable": "企業公式プレスリリース"
    }
  ],
  "next_questions": [
    "AIエージェントの導入ROIを定量的に示した事例はあるか？",
    "MCP vs A2Aのプロトコル競争、現時点での採用企業数と勢いの差は？",
    "日本企業のAIエージェント導入における法規制・コンプライアンス上の課題は？"
  ],
  "hooks": [
    "2026年はAIエージェント元年じゃない。「マルチエージェント協調」元年だ。1体のAIに全部やらせる時代は終わった。",
    "コーディングエージェント市場が前年比300%成長。もうAIにコード書かせない開発者の方が珍しくなる。",
    "MCPとA2A、エージェント時代のHTTPを巡る戦いが始まった。勝者がこの先10年のAIインフラを決める。"
  ]
}
```

---

## Example 3: 料金相場 (Pricing Benchmarks)

### Input

```
日本のSaaS企業向けカスタマーサクセスツールの料金相場を調査
```

### Expected Output

```json
{
  "summary": "日本市場で利用されている主要カスタマーサクセス（CS）ツールの料金は、月額5万円〜50万円/月が中心帯。海外製ツール（Gainsight, ChurnZero等）は月額30万円〜100万円以上とエンタープライズ寄りの価格帯。国産ツール（HiCustomer, commmune, Fullstar等）は月額5万円〜30万円で中小SaaS企業にも手が届く価格設定。2025年後半から「AI搭載CS」が増え、AIによるチャーン予測・ヘルススコア自動計算を標準機能として含むツールが増加傾向にある。従業員100名以下のSaaS企業では国産ツールが主流、500名以上ではGainsight等の海外製が採用される傾向。",
  "key_points": [
    "国産CSツールの中心価格帯は月額5万〜30万円、海外製は30万〜100万円以上",
    "初期費用は国産で10万〜50万円、海外製で100万〜300万円が相場",
    "契約は年間契約が主流（月額表示でも年払い前提が多い）",
    "AI搭載ツールは非搭載比で20-30%高い価格設定だが、2026年は標準化しつつある",
    "ユーザー数課金（per seat）と管理顧客数課金（per account）の2つの課金モデルが混在",
    "無料プラン・フリートライアルがあるのは国産ツールの一部のみ"
  ],
  "comparisons": [
    {
      "name": "HiCustomer",
      "notes": [
        "価格: 月額10万円〜（年間契約）、初期費用30万円",
        "課金モデル: 管理顧客数ベース",
        "特徴: 国産No.1のCS専用ツール。ヘルススコア・チャーン予測・タスク管理",
        "ターゲット: 国内SaaS企業（50〜500名規模）"
      ]
    },
    {
      "name": "commmune",
      "notes": [
        "価格: 月額15万円〜（年間契約）、初期費用50万円",
        "課金モデル: コミュニティ規模ベース",
        "特徴: コミュニティ型CS。ユーザーコミュニティ構築+CS管理の統合",
        "ターゲット: BtoB SaaS、コミュニティ運営重視の企業"
      ]
    },
    {
      "name": "Fullstar",
      "notes": [
        "価格: 月額5万円〜（年間契約）、初期費用10万円",
        "課金モデル: ユーザー数ベース",
        "特徴: チュートリアル・オンボーディング特化。エンジニア不要で設定可能",
        "ターゲット: SaaS企業のオンボーディング改善"
      ]
    },
    {
      "name": "Gainsight",
      "notes": [
        "価格: 月額50万円〜（年間契約）、初期費用200万円〜",
        "課金モデル: 管理顧客数+ユーザー数ベース",
        "特徴: グローバルNo.1のCSプラットフォーム。AI予測・360度顧客ビュー",
        "ターゲット: エンタープライズ（500名以上、ARR数十億以上）"
      ]
    },
    {
      "name": "ChurnZero",
      "notes": [
        "価格: 月額30万円〜（年間契約）、初期費用100万円〜",
        "課金モデル: 管理顧客数ベース",
        "特徴: リアルタイム利用状況追跡・自動プレイブック・チャーンスコア",
        "ターゲット: 中〜大規模SaaS企業"
      ]
    }
  ],
  "sources": [
    {
      "title": "カスタマーサクセスツール比較15選【2026年最新】- ITreview",
      "url": "https://www.itreview.jp/categories/customer-success",
      "published_at": "2026-01-30",
      "why_reliable": "国内最大級のSaaSレビューサイト"
    },
    {
      "title": "HiCustomer 料金プラン",
      "url": "https://hicustomer.jp/pricing/",
      "published_at": null,
      "why_reliable": "公式サイトの料金ページ"
    },
    {
      "title": "Gainsight Pricing",
      "url": "https://www.gainsight.com/pricing/",
      "published_at": null,
      "why_reliable": "公式サイトの料金ページ"
    },
    {
      "title": "SaaS企業のカスタマーサクセス最前線 - SaaS業界レポート2026",
      "url": "https://initial.inc/articles/saas-customer-success-2026",
      "published_at": "2026-02-01",
      "why_reliable": "INITIAL（旧entrepedia）のSaaS業界レポート"
    },
    {
      "title": "Customer Success Software Market Report - G2",
      "url": "https://www.g2.com/categories/customer-success",
      "published_at": "2026-01-15",
      "why_reliable": "グローバル大手ソフトウェアレビューサイト"
    }
  ],
  "next_questions": [
    "各ツールの導入〜効果実感までの平均期間とオンボーディング工数は？",
    "国産CSツールのAPI連携先（Salesforce, HubSpot等）の対応状況は？",
    "CSツール導入によるチャーンレート改善の具体的な数値事例はあるか？"
  ],
  "hooks": [
    "カスタマーサクセスツール、国産なら月5万から始められる。「高くて導入できない」はもう言い訳にならない。",
    "Gainsightが月50万、HiCustomerが月10万。5倍の価格差の正体は「AI予測精度」と「グローバル対応」だった。",
    "2026年のCSツール選び、最重要基準は「AI搭載かどうか」。チャーン予測の自動化で解約率が平均15%改善というデータも。"
  ]
}
```

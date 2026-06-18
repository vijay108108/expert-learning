import {
  Award, Bot, Briefcase, Clock3, Code2, FolderKanban,
  GraduationCap, Layers, Sparkles, Terminal, Users2, Zap,
} from "lucide-react";
import { ProgramPageLayout, type ProgramPageData } from "@/components/programs/program-page-layout";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "AI Tools Master Program — 8 Weeks | GenZNext",
  description:
    "8-week practical AI tools program: ChatGPT, Claude, Gemini, Midjourney, GitHub Copilot, Notion AI, ElevenLabs, Runway, Perplexity & 20+ more. Real use cases for business, marketing, content & coding.",
  path: "/programs/ai-tools-master",
});

const data: ProgramPageData = {
  badge: "AI Tools Mastery Track",
  badgeColor: "border-[#DDD6FE] bg-[#F5F3FF] text-[#6D28D9]",
  tag: "🚫 Zero Coding · Zero Tech Background Needed",
  tagline: "Master 25+ AI Tools in 8 Weeks — Anyone Can Join",
  title: "Practical AI Tools Master Program",
  description:
    "An 8-week program for EVERYONE — students, professionals, business owners, homemakers, teachers, marketers. No coding. No technical background. No experience needed. Just learn the world's most powerful AI tools and work 10× faster.",
  chips: [
    "🚫 No Coding Ever", "🚫 No Tech Background", "✅ Anyone Can Join",
    "ChatGPT & Claude", "Midjourney & DALL-E", "GitHub Copilot",
    "ElevenLabs & Runway", "Zapier AI", "Certificate Included",
  ],
  stats: [
    { icon: Clock3,        label: "8 Weeks" },
    { icon: Sparkles,      label: "25+ AI Tools" },
    { icon: FolderKanban,  label: "30+ Use Cases" },
    { icon: Users2,        label: "Live Sessions" },
  ],
  price:         "Rs. 69,999",
  originalPrice: "Rs. 99,999",
  priceLabel:    "30% off — No coding. No tech background. Just results.",
  enrollSlug:    "ai-tools-master-program",
  enrollFeatures: [
    { icon: Clock3,        text: "8 Weeks (2 Months)" },
    { icon: GraduationCap, text: "🚫 Zero Coding Required — Ever" },
    { icon: GraduationCap, text: "🚫 No Technical Background Needed" },
    { icon: Sparkles,      text: "25+ AI Tools with Live Demos" },
    { icon: Award,         text: "Certificate Included" },
    { icon: Users2,        text: "Live Sessions + Lifetime Access" },
  ],
  roadmap: [
    "ChatGPT & Claude Mastery",
    "AI Content & Image Creation",
    "AI Video, Voice & Presentation",
    "AI Coding & Productivity",
    "AI Business Automation",
  ],

  phases: [
    /* ────────────────────────────────────────────────────
       WEEK 1–2 — Conversational AI: ChatGPT, Claude, Gemini
    ──────────────────────────────────────────────────── */
    {
      label: "Week 1–2",
      title: "Conversational AI — ChatGPT, Claude & Gemini",
      duration: "2 Weeks",
      color: "bg-[#F5F3FF] text-[#6D28D9] border-[#DDD6FE]",
      icon: Bot,
      objective:
        "Master the three dominant AI assistants used by 500M+ people. Learn how to write prompts that get results, use advanced features, and apply these tools to real work — writing, research, analysis, coding and decision-making.",
      modules: [
        {
          title: "ChatGPT (GPT-5.5) — Complete Mastery",
          week: "Week 1",
          topics: [
            "ChatGPT vs GPT-5.5 vs GPT-5.5 mini vs o3 — which to use when",
            "Prompt engineering fundamentals: role, context, format, tone",
            "Custom Instructions: set your persona and preferences once",
            "Advanced voice mode: real-time conversation and analysis",
            "Vision: analyse images, charts, PDFs and screenshots",
            "Data Analysis (Code Interpreter): upload CSV and get instant insights",
            "DALL-E 3 integration: generate images directly in chat",
            "ChatGPT Memory: teach it your business context permanently",
            "Custom GPTs: build your own AI assistant without coding",
            "ChatGPT API basics: automate tasks via simple API calls",
          ],
          tools: ["ChatGPT (GPT-5.5)", "Custom GPTs", "DALL-E 3", "Code Interpreter"],
          lab: "Build a Custom GPT for your business — brand voice, FAQs, product knowledge. Test it with 20 real customer questions.",
          labOutcome: "A ready-to-share Custom GPT that answers questions in your brand's voice with <5% hallucination rate",
        },
        {
          title: "Claude AI (3.5 Sonnet & Opus) — Deep Work",
          week: "Week 1",
          topics: [
            "Claude vs ChatGPT — what Claude does better",
            "200K context window: analyse entire books, codebases, reports",
            "Claude for long-form writing: articles, proposals, strategy docs",
            "Artifacts feature: generate and preview HTML, code, SVG in-chat",
            "Claude Projects: upload files and give Claude persistent context",
            "Document analysis: upload contracts, reports and extract insights",
            "Claude for code: explain, debug, refactor entire files",
            "Comparing responses: A/B testing Claude vs GPT-5.5 for your use case",
            "Constitutional AI: why Claude refuses certain requests and how to work around safely",
          ],
          tools: ["Claude Opus 4.8", "Claude Projects", "Claude Artifacts"],
          lab: "Upload a 50-page business report to Claude Projects. Generate a 5-page executive summary, 10 action items, and a competitor analysis.",
          labOutcome: "Full document intelligence workflow reducing a 3-hour analysis task to under 15 minutes",
        },
        {
          title: "Google Gemini, Perplexity & Microsoft Copilot",
          week: "Week 2",
          topics: [
            "Google Gemini 3 Pro: 1M token context, multimodal (text+image+video+audio)",
            "Gemini 3.5 Flash (May 2026): matches Claude Sonnet benchmarks at zero cost",
            "Google NotebookLM Plus: AI on your documents, YouTube videos and podcasts",
            "Perplexity Comet browser (free since Mar 2026): AI-native web browsing with answer engine",
            "Perplexity Spaces: team knowledge base with AI search and citations",
            "Perplexity Deep Research: multi-step autonomous research agent",
            "Microsoft Copilot Wave 3 (Mar 2026): Copilot Cowork — autonomous multi-step tasks in M365",
            "Copilot in Excel: natural language formulas, pivot tables and charts",
            "Copilot in PowerPoint: generate full decks with speaker notes from a prompt",
            "Microsoft Copilot + Anthropic: Wave 3 uses Claude technology under the hood",
          ],
          tools: ["Google Gemini 3 Pro", "Gemini 3.5 Flash", "NotebookLM Plus", "Perplexity Comet", "Microsoft Copilot Wave 3"],
          lab: "Research a topic with Perplexity (cited sources) → analyse data in Gemini Sheets → build a presentation with Copilot PowerPoint",
          labOutcome: "End-to-end research-to-presentation workflow completed in 45 minutes (manual equivalent: 6 hours)",
        },
      ],
      capstone: {
        title: "Week 1–2 Challenge — AI Research Report",
        deliverables: [
          "Topic researched using Perplexity with 10+ cited sources",
          "Data analysed and visualised using ChatGPT Code Interpreter",
          "10-page report written using Claude with executive summary",
          "5-slide presentation generated with Copilot PowerPoint",
          "Custom GPT built for the topic domain",
        ],
      },
    },

    /* ────────────────────────────────────────────────────
       WEEK 3 — AI Content, Writing & Marketing
    ──────────────────────────────────────────────────── */
    {
      label: "Week 3",
      title: "AI Content, Writing & Marketing Tools",
      duration: "1 Week",
      color: "bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]",
      icon: Sparkles,
      objective:
        "Create high-quality content at 10× speed using specialised AI writing and marketing tools. From blog posts and ad copy to email campaigns and social media — learn the exact workflows top marketers use.",
      modules: [
        {
          title: "Jasper AI & Copy.ai — Content at Scale",
          week: "Week 3",
          topics: [
            "Jasper AI: Brand Voice training — teach it your tone in 30 minutes",
            "Jasper Campaigns: generate full marketing campaigns (ads + email + blog) from one brief",
            "Jasper Art: AI images alongside your content",
            "Copy.ai: automated workflows for content production pipelines",
            "Copy.ai GTM (Go-To-Market): sales emails, product descriptions, SEO content",
            "Writesonic: SEO-optimised blog articles with Surfer SEO integration",
            "Anyword: predictive performance scores for ad copy before publishing",
            "Rytr: affordable long-form content for startups on a budget",
            "AI SEO writing: keyword integration, meta descriptions, FAQ sections",
            "Fact-checking AI content: tools and workflows to verify before publishing",
          ],
          tools: ["Jasper AI", "Copy.ai", "Writesonic", "Anyword", "SurferSEO"],
          lab: "Create a full content calendar for one month: 4 blog posts (outlines), 20 social posts, 5 email subjects using Jasper + Copy.ai",
          labOutcome: "30-day content calendar with copy ready to publish — normally a 40-hour/month job done in 3 hours",
        },
        {
          title: "Grammarly AI, Notion AI & Writingmate",
          week: "Week 3",
          topics: [
            "Grammarly AI: beyond grammar — tone detection, clarity rewriting, plagiarism",
            "Grammarly for Chrome: AI editing in Gmail, LinkedIn, Slack, Notion",
            "Notion AI: summarise notes, action items from meetings, generate wikis",
            "Notion AI Q&A: ask questions about your entire workspace",
            "Otter.ai: real-time meeting transcription + AI summary + action items",
            "Fireflies.ai: record, transcribe, search and share meeting intelligence",
            "Wordtune: rewrite sentences in 7 different styles instantly",
            "QuillBot: paraphrase, summarise and check for grammar in one tool",
            "AI email tools: Superhuman AI, HubSpot AI email writer",
            "LinkedIn AI: writing posts, comments and connection messages with AI",
          ],
          tools: ["Grammarly AI", "Notion AI", "Otter.ai", "Fireflies.ai", "Wordtune"],
          lab: "Record a 30-minute team meeting → Fireflies transcribes → Notion AI creates wiki + action items → Grammarly polishes follow-up email",
          labOutcome: "Zero manual note-taking workflow: every meeting auto-produces a searchable wiki with assigned action items",
        },
      ],
      capstone: {
        title: "Week 3 Challenge — Full Marketing Campaign",
        deliverables: [
          "3 SEO blog posts (1,000+ words each) using Jasper + SurferSEO",
          "Google/Meta ad copy (10 variations) with Anyword performance scores",
          "Email drip sequence (5 emails) using Copy.ai",
          "30 social media captions for Instagram + LinkedIn",
          "Meeting-to-wiki workflow demo using Fireflies + Notion AI",
        ],
      },
    },

    /* ────────────────────────────────────────────────────
       WEEK 4 — AI Image, Video & Creative Tools
    ──────────────────────────────────────────────────── */
    {
      label: "Week 4",
      title: "AI Image, Video & Creative Generation",
      duration: "1 Week",
      color: "bg-[#FFF7ED] text-[#9A3412] border-[#FED7AA]",
      icon: Zap,
      objective:
        "Create professional visuals, videos and creative assets in minutes — not days. Master the tools that are replacing expensive agencies for startups, creators and marketing teams worldwide.",
      modules: [
        {
          title: "Midjourney, Adobe Firefly & Canva AI",
          week: "Week 4",
          topics: [
            "Midjourney v7: prompting for photorealism, illustration, brand visuals",
            "Midjourney parameters: --ar, --style, --chaos, --seed for consistency",
            "Midjourney Character Reference (--cref): consistent characters across images",
            "Midjourney Style Reference (--sref): lock in a visual style for a brand",
            "Adobe Firefly: generative fill, text-to-image with commercial license",
            "Firefly in Photoshop: expand images, remove objects, generate backgrounds",
            "Canva AI: Magic Design, Magic Edit, Magic Write, Text-to-Image",
            "Canva AI presentations: generate full slide decks from a topic",
            "Ideogram: best-in-class AI for text inside images (logos, posters)",
            "Leonardo AI: consistent product mockups and game-quality images",
          ],
          tools: ["Midjourney v7", "Adobe Firefly", "Canva AI", "Ideogram", "Leonardo AI"],
          lab: "Create a complete brand identity package: logo concepts (Ideogram), hero images (Midjourney), social media templates (Canva AI) — all consistent",
          labOutcome: "15-piece brand kit (logo, banners, social templates) that matches agency quality — delivered in 2 hours, not 2 weeks",
        },
        {
          title: "Runway Gen-3, Google Veo 3.1, HeyGen & ElevenLabs",
          week: "Week 4",
          topics: [
            "Runway Gen-3 Alpha: text-to-video, image-to-video, video-to-video",
            "Runway features: Motion Brush, Act-One face animation, lip-sync",
            "Google Veo 3.1: best-in-class cinematic AI video (Sora 2 was discontinued Apr 2026)",
            "Kling AI 2.0 and Pika 2.2: alternatives for different video styles and budgets",
            "HeyGen: AI avatars — create a talking-head video without a camera",
            "HeyGen Video Translation: translate any video to 40+ languages with lip-sync",
            "ElevenLabs Voice Cloning: clone your voice in 1 minute",
            "ElevenLabs text-to-speech: natural narration for videos, podcasts, audiobooks",
            "Descript: edit video by editing text — remove filler words with AI",
            "Synthesia: create training/explainer videos with AI presenters",
          ],
          tools: ["Runway Gen-3", "Google Veo 3.1", "HeyGen", "ElevenLabs", "Descript", "Synthesia"],
          lab: "Create a 2-minute product explainer: HeyGen avatar → ElevenLabs voiceover → Runway B-roll → Descript final edit — no camera, no studio",
          labOutcome: "Professional explainer video ready for YouTube/LinkedIn produced in under 3 hours",
        },
      ],
      capstone: {
        title: "Week 4 Challenge — AI Creative Studio Project",
        deliverables: [
          "Full brand visual kit: logo, 5 hero images, 10 social templates (Midjourney + Canva)",
          "2-minute product video with AI avatar and voiceover (HeyGen + ElevenLabs)",
          "30-second Runway Gen-3 video clip from a text prompt",
          "AI-translated version of the video in 2 languages (HeyGen)",
          "Before/after comparison showing time saved vs traditional production",
        ],
      },
    },

    /* ────────────────────────────────────────────────────
       WEEK 5 — AI Coding, Development & Productivity
    ──────────────────────────────────────────────────── */
    {
      label: "Week 5",
      title: "AI Coding, Development & Productivity",
      duration: "1 Week",
      color: "bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]",
      icon: Code2,
      objective:
        "Use AI to write code, build websites and automate tasks even if you're not a developer. GitHub Copilot, Cursor and Bolt.new have made building software accessible to everyone — learn how in one week.",
      modules: [
        {
          title: "GitHub Copilot, Cursor 3 & Bolt.new",
          week: "Week 5",
          topics: [
            "GitHub Copilot: inline code suggestions, Copilot Chat, /fix, /explain, /tests",
            "GitHub Copilot for non-developers: Excel macros, SQL queries, Bash scripts",
            "Cursor 3 (Apr 2026): the biggest release since launch — Agents Window for parallel AI agents",
            "Cursor 3 Agents Window: run multiple AI agents across local, SSH and cloud environments",
            "Bolt.new: build and deploy a full web application by describing it in English",
            "v0 by Vercel: generate React UI components from a screenshot or description",
            "Replit AI: build, test and deploy web apps in the browser",
            "Windsurf IDE by Codeium: agentic coding that understands your whole project",
            "AI for no-coders: generating Airtable formulas, Zapier code steps, Google Sheets scripts",
            "Debugging with AI: paste error → get fix → understand why",
          ],
          tools: ["GitHub Copilot", "Cursor 3", "Claude Code", "Bolt.new", "v0 by Vercel", "Replit AI", "Windsurf"],
          lab: "Build a working landing page + contact form + email notification — using only Bolt.new and natural language descriptions. Zero manual coding.",
          labOutcome: "A live, deployed website with working backend logic built in under 60 minutes — no prior coding knowledge needed",
        },
        {
          title: "Gamma AI, Beautiful.ai & Motion",
          week: "Week 5",
          topics: [
            "Gamma AI: generate beautiful presentations, documents and webpages from text",
            "Gamma vs PowerPoint: when AI presentations are better",
            "Beautiful.ai: AI presentation with smart templates and auto-formatting",
            "Tome: AI storytelling — presentations that adapt to your audience",
            "Presentations.ai: upload a document, get a full branded deck",
            "Motion AI: AI calendar and task management — auto-schedules your day",
            "Reclaim.ai: protect deep work time with AI scheduling",
            "Superhuman email: AI email triage, one-click reply drafts",
            "Mem.ai: AI note-taking that automatically links related notes",
            "Merlin AI: ChatGPT/Claude on any website via browser extension",
          ],
          tools: ["Gamma AI", "Beautiful.ai", "Motion AI", "Reclaim.ai", "Mem.ai", "Merlin AI"],
          lab: "Turn a topic brief into a full presentation: Gamma generates structure → Beautiful.ai formats → add AI-generated images from Midjourney",
          labOutcome: "Investor-quality 15-slide deck produced in 20 minutes instead of 3 hours",
        },
      ],
      capstone: {
        title: "Week 5 Challenge — Build with AI",
        deliverables: [
          "Working website (landing page + form) built with Bolt.new",
          "10-slide investor pitch deck generated from a one-paragraph brief (Gamma)",
          "Personal productivity system: Motion AI calendar + Reclaim deep work blocks",
          "GitHub Copilot demo: fix 3 broken code snippets using AI",
          "Workflow audit: identify 5 tasks in your job automatable with AI coding tools",
        ],
      },
    },

    /* ────────────────────────────────────────────────────
       WEEK 6 — AI for Research, Data & Analysis
    ──────────────────────────────────────────────────── */
    {
      label: "Week 6",
      title: "AI for Research, Data & Business Analysis",
      duration: "1 Week",
      color: "bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]",
      icon: Layers,
      objective:
        "Use AI to research faster, analyse data without formulas, and generate business intelligence. These tools are changing how analysts, consultants and researchers work — cutting weeks of work to hours.",
      modules: [
        {
          title: "Perplexity, Consensus & Elicit — AI Research",
          week: "Week 6",
          topics: [
            "Perplexity Pro: real-time web research with academic sources and citations",
            "Perplexity Spaces: collaborative AI research rooms for teams",
            "Perplexity vs Google Scholar — when to use which for research",
            "Consensus AI: searches 200M academic papers — evidence-based answers",
            "Elicit: AI research assistant that summarises RCTs, studies and papers",
            "Semantic Scholar: AI-powered academic literature discovery",
            "SciSpace (Typeset): explain any research paper in plain English",
            "Research Rabbit: visualise citation networks and find related papers",
            "OpenAI Deep Research: multi-step autonomous research agent in ChatGPT",
            "Claude for literature review: analyse 20 papers in one upload",
          ],
          tools: ["Perplexity Pro", "Consensus AI", "Elicit", "SciSpace", "OpenAI Deep Research"],
          lab: "Conduct a full market research project: Perplexity for news + Consensus for studies + Claude for synthesis → 10-page report",
          labOutcome: "Research report with 30+ citations that would have taken 2 weeks to produce — completed in one 4-hour session",
        },
        {
          title: "Julius AI, Obviously AI & ChatGPT for Data",
          week: "Week 6",
          topics: [
            "Julius AI: talk to your data — upload any spreadsheet and ask questions in English",
            "Julius chart generation: create visualisations with natural language",
            "ChatGPT Advanced Data Analysis: statistical analysis, trend detection, forecasting",
            "Obviously AI: build ML prediction models without code (churn, sales, fraud)",
            "Akkio: AI data analyst for agencies and business teams",
            "Rows AI: AI-native spreadsheet with built-in GPT formulas",
            "AI Excel formulas: describe what you want, get the formula",
            "Google Sheets AI: Duet AI + AppScript generation with Gemini",
            "Tableau AI + Einstein Analytics: AI-powered BI dashboards",
            "Power BI Copilot: generate DAX, ask questions about your data in natural language",
          ],
          tools: ["Julius AI", "Obviously AI", "ChatGPT Code Interpreter", "Rows AI", "Power BI Copilot"],
          lab: "Analyse 12 months of business sales data with Julius AI: spot trends, forecast next quarter, identify top/bottom products — no Excel formulas",
          labOutcome: "A 5-chart data story with forecast for the next quarter — produced without writing a single formula",
        },
      ],
      capstone: {
        title: "Week 6 Challenge — AI Business Intelligence Report",
        deliverables: [
          "Market research report (10 pages) with 30 cited sources using Perplexity + Consensus",
          "Sales data analysis dashboard created entirely in Julius AI",
          "ML prediction model built in Obviously AI (no code)",
          "Academic literature review using Elicit + SciSpace",
          "Comparison: AI research vs manual research — time and quality audit",
        ],
      },
    },

    /* ────────────────────────────────────────────────────
       WEEK 7 — AI Business Automation & Workflows
    ──────────────────────────────────────────────────── */
    {
      label: "Week 7",
      title: "AI Business Automation — Zapier, Make & n8n",
      duration: "1 Week",
      color: "bg-[#FEFCE8] text-[#854D0E] border-[#FDE68A]",
      icon: Zap,
      objective:
        "Connect AI tools together and automate entire business workflows without writing code. Learn the automation tools that let a 2-person startup run like a 20-person team — the superpower every entrepreneur needs in 2025.",
      modules: [
        {
          title: "Zapier AI, Make & n8n — Workflow Automation",
          week: "Week 7",
          topics: [
            "Zapier AI: build Zaps using plain English descriptions",
            "Zapier + ChatGPT: AI inside every automation step",
            "Zapier Tables + Interfaces: lightweight CRM built with AI",
            "Make (Integromat): visual workflow builder for complex automations",
            "Make + OpenAI: classify emails, generate responses, summarise documents",
            "n8n: open-source automation with AI nodes (self-hostable)",
            "AI email automation: auto-respond, auto-classify, auto-route leads",
            "AI CRM automation: HubSpot + AI lead scoring and enrichment",
            "Webhook + API automation: connect any tool with AI logic",
            "Automation ROI calculation: quantify time and cost saved per workflow",
          ],
          tools: ["Zapier", "Make (Integromat)", "n8n", "Zapier AI", "HubSpot AI"],
          lab: "Build 3 live automations: (1) Lead form → AI qualification → CRM + Slack notification. (2) Email → AI summary → Notion database. (3) New order → AI invoice → Gmail.",
          labOutcome: "3 running automations saving estimated 2+ hours/day for a typical SMB",
        },
        {
          title: "AI for Sales, HR & Customer Service",
          week: "Week 7",
          topics: [
            "HubSpot AI: AI email writer, deal summary, call transcription and coaching",
            "Salesforce Einstein: lead scoring, opportunity insights, email generation",
            "Apollo.io AI: AI prospecting, personalised outreach at scale",
            "Clay AI: AI data enrichment and hyper-personalised cold email",
            "Intercom AI (Fin): AI customer support that resolves 40%+ tickets automatically",
            "Zendesk AI: ticket triage, suggested responses, CSAT prediction",
            "Workday AI + BambooHR: AI resume screening, HR document generation",
            "Loom AI: async video messages with AI summaries and chapters",
            "Gong.io: AI sales call analysis — what top reps do differently",
            "Lavender: AI email coach that scores your cold emails before sending",
          ],
          tools: ["HubSpot AI", "Apollo.io", "Clay AI", "Intercom Fin", "Gong.io", "Lavender"],
          lab: "Build an AI-powered lead qualification system: Apollo prospecting → Clay enrichment → AI email draft → HubSpot auto-log",
          labOutcome: "An AI sales pipeline generating 50 personalised outreach emails/day with zero manual research",
        },
      ],
      capstone: {
        title: "Week 7 Challenge — AI-Powered Business Stack",
        deliverables: [
          "Lead-to-CRM automation: form → AI qualify → HubSpot + Slack (live Zap)",
          "Email management workflow: inbox → AI categorise → Notion tasks",
          "AI customer support demo: Intercom Fin handling 10 test queries",
          "50-email outreach sequence: Apollo prospects → Clay enriches → Lavender scores",
          "ROI calculator showing hours saved per week from each automation",
        ],
      },
    },

    /* ────────────────────────────────────────────────────
       WEEK 8 — Prompt Mastery, AI Ethics & Final Project
    ──────────────────────────────────────────────────── */
    {
      label: "Week 8",
      title: "Prompt Mastery, AI Ethics & Final Capstone",
      duration: "1 Week",
      color: "bg-[#F0F9FF] text-[#0C4A6E] border-[#BAE6FD]",
      icon: Award,
      objective:
        "Consolidate your AI toolkit, master advanced prompting patterns, understand AI ethics and limitations, and build your final showcase project. Leave with a portfolio demonstrating measurable AI-driven results.",
      modules: [
        {
          title: "Advanced Prompt Engineering for Business",
          week: "Week 8",
          topics: [
            "Mega-prompts: combine role + context + steps + format + constraints",
            "RICE framework for prompts: Role, Instructions, Context, Examples",
            "The CO-STAR framework: Context, Objective, Style, Tone, Audience, Response",
            "Chain prompting: break complex tasks into linked prompts",
            "Prompt chaining in Zapier and Make — multi-step AI workflows",
            "Prompt libraries: building your personal prompt collection",
            "Prompt testing and iteration: systematic improvement approach",
            "System prompts for Custom GPTs and Claude Projects",
            "Generating prompts with AI (meta-prompting): ask AI to write your prompts",
            "The 3-second rule: evaluate any AI output before using it",
          ],
          tools: ["ChatGPT", "Claude", "PromptLayer", "Notion (prompt library)"],
          lab: "Build a personal prompt library of 50 prompts across 10 categories — test each and document quality, speed and cost",
          labOutcome: "A shareable Notion prompt library that makes every future AI task 60% faster",
        },
        {
          title: "AI Ethics, Limitations & Responsible Use",
          week: "Week 8",
          topics: [
            "AI hallucinations: why they happen and how to verify AI output",
            "Copyright and AI-generated content: what you can and cannot use commercially",
            "Data privacy: what NOT to put into public AI tools (personal data, IP)",
            "Deepfakes and synthetic media: detection tools and ethical guidelines",
            "AI bias: how training data shapes outputs and what it means for your use",
            "GDPR, AI Act (EU) and India's DPDP Act: compliance basics for AI usage",
            "Watermarking and disclosure: when to disclose AI-generated content",
            "Job displacement vs job transformation: the honest picture for 2025–2030",
            "Building AI-resistant skills: what AI still can't do well",
            "Staying updated: the 5 best sources for AI news and tool releases",
          ],
          tools: ["Originality.ai", "GPTZero", "TrueMedia.org (deepfake detection)"],
          lab: "Audit 5 AI-generated pieces of content for accuracy, copyright issues and disclosure requirements — fix all issues found",
          labOutcome: "An AI content quality checklist your team can follow before publishing any AI-generated material",
        },
      ],
      capstone: {
        title: "Final Capstone — AI Transformation Project",
        deliverables: [
          "Choose one: Business, career or personal project transformed with AI",
          "Before/after documentation: process, time, quality and cost comparison",
          "5+ AI tools integrated into a working workflow (Zapier/Make connected)",
          "3-minute video walkthrough using Loom + AI voiceover (ElevenLabs)",
          "Prompt library (50 prompts) published as a shareable Notion page",
          "AI tools portfolio: screenshots, results and ROI for each tool used",
        ],
      },
    },
  ],

  bonusTracks: [
    {
      icon: Terminal,
      title: "AI Tools for Students",
      topics: [
        "NotebookLM: study from your own notes and textbooks",
        "Consensus: evidence-based answers for assignments",
        "Tome: AI presentations for college projects",
        "Elicit: research paper summaries in plain English",
        "Grammarly AI: polish essays and reports",
      ],
    },
    {
      icon: Zap,
      title: "AI for Freelancers & Creators",
      topics: [
        "10× your output with AI content pipelines",
        "Pricing AI-assisted work ethically",
        "Building a personal brand with AI (LinkedIn + YouTube)",
        "AI tools for client proposals and SOWs",
        "Passive income with AI: templates, courses, GPTs",
      ],
    },
    {
      icon: Bot,
      title: "Emerging AI Tools (2025)",
      topics: [
        "OpenAI o1/o3: reasoning models for complex problems",
        "Google Veo 2: cinematic AI video generation",
        "xAI Grok 2: real-time X/Twitter data access",
        "Meta Llama 3: running open-source AI locally",
        "Staying ahead: frameworks for evaluating new AI tools",
      ],
    },
  ],

  certifications: [
    { code: "Program Certificate",     title: "GenZNext AI Tools Mastery Certificate",         emoji: "🏆" },
    { code: "Google AI Essentials",    title: "Google AI Essentials Certificate (prep)",        emoji: "🌐" },
    { code: "Microsoft AI-900",        title: "Azure AI Fundamentals AI-900 (optional prep)",   emoji: "🟦" },
  ],

  projects: [
    { title: "Custom GPT for Your Business",         desc: "Build a brand-aware ChatGPT with your FAQs, product knowledge and tone — shareable with customers" },
    { title: "AI Brand Identity Kit",               desc: "Logo concepts (Ideogram) + hero images (Midjourney) + social templates (Canva AI) in 2 hours" },
    { title: "30-Day Content Calendar",             desc: "4 blog posts + 20 social captions + 5 email subjects generated using Jasper + Copy.ai + ChatGPT" },
    { title: "AI Product Explainer Video",          desc: "2-minute video: HeyGen avatar + ElevenLabs voice + Runway B-roll + Descript edit — no camera needed" },
    { title: "Market Research Report",              desc: "10-page report with 30+ cited sources researched using Perplexity Pro + Consensus + Claude analysis" },
    { title: "Sales Data Dashboard",               desc: "Julius AI analyses 12 months of data: trends, forecasts, top/bottom products — no formulas written" },
    { title: "AI Lead Qualification Pipeline",      desc: "Apollo → Clay → AI email personalisation → HubSpot auto-log — 50 personalised outreaches/day" },
    { title: "3-Zap Automation System",             desc: "Lead form → CRM → Slack + Email auto-categorise → Notion + Order → Invoice → Gmail" },
    { title: "No-Code Landing Page",               desc: "Working website with form, email notifications and CMS — built entirely with Bolt.new from a description" },
    { title: "AI Investor Pitch Deck",             desc: "15-slide deck generated from a paragraph brief using Gamma + Midjourney images + Beautiful.ai formatting" },
    { title: "AI Research Literature Review",       desc: "Academic literature review on a topic using Elicit + SciSpace + Claude 200K context window" },
    { title: "Personal AI Prompt Library",         desc: "50 tested and rated prompts across 10 categories in a shareable Notion page with quality scores" },
  ],

  technologies: [
    "ChatGPT (GPT-5.5)", "Claude Opus 4.8", "Google Gemini 3 Pro", "Gemini 3.5 Flash",
    "DeepSeek V4 Pro", "Microsoft Copilot Wave 3", "Perplexity Comet",
    "Midjourney v7", "DALL-E 3", "Adobe Firefly", "Canva AI",
    "Runway Gen-3", "Google Veo 3.1", "HeyGen", "ElevenLabs", "Descript",
    "GitHub Copilot", "Cursor AI", "Bolt.new", "Gamma AI",
    "Jasper AI", "Copy.ai", "Notion AI", "Grammarly AI", "Otter.ai",
    "Zapier AI", "Make (Integromat)", "n8n", "Julius AI", "Consensus AI",
    "HubSpot AI", "Clay AI", "Apollo.io", "NotebookLM", "v0 by Vercel",
  ],

  careerTiers: [
    {
      level: "Professional — Any Role",
      roles: ["AI-augmented marketer", "AI-powered analyst", "AI-enhanced developer", "AI-first entrepreneur"],
      color: "border-[#DDD6FE] bg-[#F5F3FF]",
    },
    {
      level: "Freelancer / Creator",
      roles: ["AI content creator", "AI video producer", "AI automation consultant", "Custom GPT developer"],
      color: "border-[#BBF7D0] bg-[#F0FDF4]",
    },
    {
      level: "Business Owner / Leader",
      roles: ["AI-first startup founder", "Marketing team AI lead", "Operations automation head", "Digital transformation lead"],
      color: "border-[#FED7AA] bg-[#FFF7ED]",
    },
  ],

  idealFor: [
    {
      icon: GraduationCap,
      title: "Students (Any Stream)",
      desc: "B.Tech, MBA, Arts, Commerce — doesn't matter. No coding. No tech knowledge. If you can use a smartphone, you can master AI tools and get hired faster than your peers.",
      color: "text-[#059669]",
      bg: "bg-[#ECFDF5]",
    },
    {
      icon: Briefcase,
      title: "Working Professionals",
      desc: "Doctor, teacher, marketer, HR, finance, sales — every role benefits. Use AI to finish your daily work in half the time and stand out in your company.",
      color: "text-[#6D28D9]",
      bg: "bg-[#F5F3FF]",
    },
    {
      icon: Users2,
      title: "Business Owners & Entrepreneurs",
      desc: "Run your business like a 20-person team with just yourself. Content, videos, customer support, research, automation — AI does the heavy lifting.",
      color: "text-[#D97706]",
      bg: "bg-[#FFFBEB]",
    },
  ],

  faqs: [
    { q: "Do I need to know coding or AI to join?", a: "ABSOLUTELY NOT. Zero coding. Zero technical background. Zero prior experience. If you can send a WhatsApp message, you can do this program. We designed it specifically for non-technical people." },
    { q: "Do I need paid subscriptions to all 25+ tools?", a: "No. Most tools have free tiers sufficient for learning. We estimate ₹500–1,500/month in optional paid tools during the program. We'll guide you on which free tiers work and when upgrading is worth it." },
    { q: "How is this different from watching YouTube tutorials?", a: "Live sessions, real projects, structured progression, doubt clearing, peer community and a certificate. YouTube gives you fragments — this gives you a complete, applied workflow system." },
    { q: "Will these tools still be relevant in 1–2 years?", a: "The specific tools will evolve but the skill of quickly adopting and mastering new AI tools will only become more valuable. This program teaches you the mental model, not just button clicks." },
    { q: "Can I access recordings if I miss a live session?", a: "Yes — all sessions are recorded and available on the LMS within 24 hours. You can also attend future batch sessions for topics you missed." },
  ],
};

export default function AiToolsMasterPage() {
  return <ProgramPageLayout data={data} />;
}

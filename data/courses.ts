import type { IconKey } from "@/lib/icon-map";

export type CourseCategoryKey = "aws" | "azure" | "ai" | "devops";
export type CourseBadgeTone = "green" | "orange" | "blue" | "purple";
export type CourseTrackKey =
  | "ai"
  | "generative-ai"
  | "agentic-ai"
  | "devsecops"
  | "aws-certifications"
  | "azure-certifications";
export type CourseMode = "live" | "self-paced" | "recorded" | "hybrid";
export type CoursePriceType = "one-time";

export type CourseLesson = {
  title: string;
  description: string;
  url: string;
  duration: string;
  lessonType: "youtube";
  locked: boolean;
};

export type CourseResource = {
  title: string;
  description: string;
  type: "official-doc" | "pdf" | "notes" | "assignment" | "certification-guide";
  url: string;
};

export type CourseFaq = {
  question: string;
  answer: string;
};

export type Course = {
  title: string;
  slug: string;
  track: CourseTrackKey;
  category: CourseCategoryKey;
  shortDescription: string;
  longDescription: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  mode: CourseMode;
  priceType: CoursePriceType;
  certification: string;
  toolsCovered: string[];
  skillsYouWillLearn: string[];
  learningOutcomes: string[];
  targetAudience: string[];
  prerequisites: string[];
  syllabusModules: string[];
  projects: string[];
  officialResources: CourseResource[];
  youtubeLessons: CourseLesson[];
  lmsResources: CourseResource[];
  faqs: CourseFaq[];
  subtitle: string;
  overview: string;
  rating: number;
  priceValue: number;
  originalPriceValue: number;
  price: string;
  originalPrice: string;
  highlight: string;
  tagLabel: string;
  tagTone: CourseBadgeTone;
  certificate: string;
  icon: IconKey;
  tags: string[];
  officialSyllabusUrl: string;
  roadmap: string[];
  outcomes: string[];
};

function formatPrice(value: number) {
  return `INR ${value.toLocaleString("en-IN")}`;
}

function buildYoutubeLessons(trackTitle: string): CourseLesson[] {
  return [
    {
      title: `${trackTitle} Overview Session`,
      description: "Program introduction and learning roadmap.",
      url: "",
      duration: "~15 mins",
      lessonType: "youtube",
      locked: false,
    },
    {
      title: `${trackTitle} Hands-on Lab Walkthrough`,
      description: "Practical implementation walkthrough with mentor notes.",
      url: "",
      duration: "~20 mins",
      lessonType: "youtube",
      locked: false,
    },
    {
      title: `${trackTitle} Advanced Discussion`,
      description: "Exam and project strategy for production-level readiness.",
      url: "",
      duration: "~16 mins",
      lessonType: "youtube",
      locked: true,
    },
  ];
}

function createCourse(input: Omit<Course, "price" | "originalPrice" | "overview" | "subtitle" | "roadmap" | "outcomes">): Course {
  return {
    ...input,
    subtitle: input.shortDescription,
    overview: input.longDescription,
    roadmap: input.syllabusModules,
    outcomes: input.learningOutcomes,
    price: formatPrice(input.priceValue),
    originalPrice: formatPrice(input.originalPriceValue),
  };
}

const commonOfficialResources: CourseResource[] = [
  {
    title: "Microsoft Learn",
    description: "Official learning paths and role-based modules.",
    type: "official-doc",
    url: "https://learn.microsoft.com/training/",
  },
  {
    title: "AWS Skill Builder",
    description: "Official AWS labs and certification prep journeys.",
    type: "official-doc",
    url: "https://skillbuilder.aws/",
  },
  {
    title: "AWS Training",
    description: "Official AWS training and certification guidance.",
    type: "official-doc",
    url: "https://aws.amazon.com/training/",
  },
  {
    title: "Azure Documentation",
    description: "Official Azure service and architecture docs.",
    type: "official-doc",
    url: "https://learn.microsoft.com/azure/",
  },
  {
    title: "GitHub Documentation",
    description: "Actions, security, and developer workflow documentation.",
    type: "official-doc",
    url: "https://docs.github.com/",
  },
  {
    title: "Kubernetes Documentation",
    description: "Official Kubernetes concepts and production guides.",
    type: "official-doc",
    url: "https://kubernetes.io/docs/home/",
  },
  {
    title: "Docker Documentation",
    description: "Official Docker engine and container docs.",
    type: "official-doc",
    url: "https://docs.docker.com/",
  },
  {
    title: "OWASP Top 10",
    description: "Security reference for secure-by-design engineering.",
    type: "official-doc",
    url: "https://owasp.org/www-project-top-ten/",
  },
];

function buildLmsResources(courseName: string): CourseResource[] {
  return [
    { title: `${courseName} PDF Notes`, description: "Module-wise revision notes.", type: "pdf", url: "/contact" },
    { title: `${courseName} Mentor Notes`, description: "Practical implementation notes.", type: "notes", url: "/contact" },
    { title: `${courseName} Practice Assignment`, description: "Hands-on assignment with review rubric.", type: "assignment", url: "/contact" },
    { title: `${courseName} Certification Guide`, description: "Exam blueprint and revision checkpoints.", type: "certification-guide", url: "/contact" },
  ];
}

function buildFaqs(certification: string): CourseFaq[] {
  return [
    {
      question: "Is this course suitable for working professionals?",
      answer: "Yes. The course includes flexible recorded support and assignment windows for working learners.",
    },
    {
      question: "Do I get certification preparation support?",
      answer: `Yes. This program includes structured guidance for ${certification} with revision plans and mock checkpoints.`,
    },
  ];
}

function buildCourseData(): Record<CourseCategoryKey, Course[]> {
  const aiCourses: Course[] = [
    createCourse({
      title: "Applied AI Foundations",
      slug: "applied-ai-foundations",
      track: "ai",
      category: "ai",
      shortDescription: "Build practical AI foundations for real-world workflows and product use-cases.",
      longDescription:
        "Applied AI Foundations helps learners understand AI concepts, problem framing, and implementation patterns through guided examples and practical assignments.",
      level: "Beginner",
      duration: "6 Weeks",
      mode: "self-paced",
      priceType: "one-time",
      certification: "GenZNext Applied AI Foundation Credential",
      toolsCovered: ["Python", "Pandas", "Scikit-learn", "Jupyter", "Google Colab"],
      skillsYouWillLearn: ["AI problem framing", "Data preparation basics", "Model evaluation", "Practical AI workflow design"],
      learningOutcomes: ["Understand applied AI lifecycle", "Build beginner AI workflows", "Present project outcomes clearly"],
      targetAudience: ["Students entering AI", "Career switchers", "Junior developers"],
      prerequisites: ["Basic computer literacy", "Optional Python basics"],
      syllabusModules: ["Module 1: AI Landscape 2026 - LLMs, multimodal models, and where AI fits in business","Module 2: Problem Framing - turning a business need into an AI-solvable task","Module 3: Data Handling Basics with Python, Pandas, and Google Colab","Module 4: Intro to Models - classification, regression, and using pre-trained APIs (OpenAI, Gemini)","Module 5: Model Evaluation - accuracy, precision/recall, and avoiding common pitfalls","Module 6: Responsible AI - bias, hallucination awareness, and data privacy basics","Module 7: Capstone - build and present an end-to-end applied AI mini-project"],
      projects: ["Customer churn predictor", "Lead scoring mini-project"],
      officialResources: commonOfficialResources,
      youtubeLessons: buildYoutubeLessons("Applied AI Foundations"),
      lmsResources: buildLmsResources("Applied AI Foundations"),
      faqs: buildFaqs("Applied AI Foundation"),
      rating: 4.7,
      priceValue: 8999,
      originalPriceValue: 12999,
      highlight: "Beginner Friendly",
      tagLabel: "Foundation",
      tagTone: "green",
      certificate: "Applied AI Foundations Completion",
      icon: "brain",
      tags: ["AI", "Foundations", "Beginner"],
      officialSyllabusUrl: "https://learn.microsoft.com/training/",
    }),
    createCourse({
      title: "AI for Business Automation",
      slug: "ai-for-business-automation",
      track: "ai",
      category: "ai",
      shortDescription: "Automate business workflows using modern AI tools and no-code accelerators.",
      longDescription:
        "This program focuses on practical business automation with AI assistants, workflow templates, and productivity systems for operations, analytics, and support teams.",
      level: "Beginner",
      duration: "5 Weeks",
      mode: "self-paced",
      priceType: "one-time",
      certification: "GenZNext AI Business Automation Credential",
      toolsCovered: ["ChatGPT", "Microsoft Copilot", "Zapier", "Notion AI", "Google Workspace AI"],
      skillsYouWillLearn: ["Workflow automation", "Prompt-to-process design", "AI productivity systems", "Reporting automation"],
      learningOutcomes: ["Automate recurring tasks", "Improve turnaround time", "Create AI SOP playbooks"],
      targetAudience: ["Business analysts", "Operations teams", "Entrepreneurs"],
      prerequisites: ["No coding required"],
      syllabusModules: ["Module 1: 2026 AI Tools Landscape - ChatGPT, Microsoft Copilot, Gemini, Claude for business","Module 2: No-Code Automation with Zapier and Make - connecting business apps","Module 3: Prompt-to-Process Design - turning SOPs into repeatable AI workflows","Module 4: Notion AI and Google Workspace AI for reporting and documentation automation","Module 5: Customer Support Automation - AI chat assistants and ticket triage","Module 6: Measuring ROI - tracking time saved and building an automation playbook","Module 7: Capstone - automate a real operations or sales workflow end-to-end"],
      projects: ["AI-powered support workflow", "Sales operations assistant"],
      officialResources: commonOfficialResources,
      youtubeLessons: buildYoutubeLessons("AI for Business Automation"),
      lmsResources: buildLmsResources("AI for Business Automation"),
      faqs: buildFaqs("AI Business Automation"),
      rating: 4.6,
      priceValue: 8999,
      originalPriceValue: 12999,
      highlight: "No-Code Friendly",
      tagLabel: "Business Track",
      tagTone: "green",
      certificate: "AI for Business Automation Completion",
      icon: "briefcase",
      tags: ["AI", "Automation", "No-Code"],
      officialSyllabusUrl: "https://learn.microsoft.com/training/paths/introduction-generative-ai/",
    }),
    createCourse({
      title: "Machine Learning Foundations",
      slug: "machine-learning-foundations",
      track: "ai",
      category: "ai",
      shortDescription: "Learn core machine learning algorithms and model evaluation workflows.",
      longDescription:
        "Machine Learning Foundations covers supervised and unsupervised learning, validation strategies, and practical model improvement approaches through applied projects.",
      level: "Intermediate",
      duration: "7 Weeks",
      mode: "self-paced",
      priceType: "one-time",
      certification: "GenZNext Machine Learning Foundation Credential",
      toolsCovered: ["Python", "Scikit-learn", "NumPy", "Pandas", "Matplotlib"],
      skillsYouWillLearn: ["Feature engineering", "Model training", "Validation strategy", "Error analysis"],
      learningOutcomes: ["Train ML models confidently", "Choose models by problem type", "Explain model trade-offs"],
      targetAudience: ["Aspiring ML engineers", "Developers", "Data analysts"],
      prerequisites: ["Python basics", "Basic statistics"],
      syllabusModules: ["Module 1: ML Foundations - supervised vs unsupervised learning, the 2026 ML toolchain","Module 2: Feature Engineering with Pandas and NumPy","Module 3: Core Algorithms - linear/logistic regression, decision trees, random forests, gradient boosting (XGBoost)","Module 4: Model Validation - cross-validation, train/test splits, avoiding overfitting","Module 5: Error Analysis and Hyperparameter Tuning with Scikit-learn","Module 6: Unsupervised Learning - clustering and dimensionality reduction","Module 7: Model Deployment Basics - packaging a model for production use","Module 8: Capstone - fraud detection or demand forecasting project with full ML pipeline"],
      projects: ["Fraud detection classifier", "Demand forecasting model"],
      officialResources: commonOfficialResources,
      youtubeLessons: buildYoutubeLessons("Machine Learning Foundations"),
      lmsResources: buildLmsResources("Machine Learning Foundations"),
      faqs: buildFaqs("Machine Learning Foundation"),
      rating: 4.8,
      priceValue: 12999,
      originalPriceValue: 16999,
      highlight: "Project Based",
      tagLabel: "ML Track",
      tagTone: "blue",
      certificate: "Machine Learning Foundations Completion",
      icon: "cpu",
      tags: ["Machine Learning", "Python", "Models"],
      officialSyllabusUrl: "https://learn.microsoft.com/training/",
    }),
  ];

  const genAiCourses: Course[] = [
    createCourse({
      title: "Generative AI Master Program",
      slug: "generative-ai",
      track: "generative-ai",
      category: "ai",
      shortDescription: "Master LLM applications, RAG, evaluation, and production-grade GenAI systems.",
      longDescription:
        "A flagship mentor-led journey covering advanced prompting, orchestration, retrieval pipelines, safety patterns, and deployment strategy for real-world GenAI products.",
      level: "Advanced",
      duration: "10 Weeks",
      mode: "self-paced",
      priceType: "one-time",
      certification: "GenZNext Generative AI Master Credential",
      toolsCovered: ["OpenAI APIs", "LangChain", "Vector Databases", "FastAPI", "Evaluation Frameworks"],
      skillsYouWillLearn: ["Prompt architecture", "RAG implementation", "LLM evaluation", "Production integration"],
      learningOutcomes: ["Ship production-ready GenAI apps", "Implement retrieval-enhanced assistants", "Optimize quality and cost"],
      targetAudience: ["AI engineers", "Backend developers", "Product builders"],
      prerequisites: ["Python", "API basics", "Prompting fundamentals"],
      syllabusModules: ["Module 1: 2026 LLM Landscape - GPT-5.x, Claude Opus/Sonnet 4.x, Gemini 3, open-weight models","Module 2: Advanced Prompt Architecture - chain-of-thought, structured outputs, function calling","Module 3: Retrieval-Augmented Generation (RAG) - chunking, embeddings, vector databases","Module 4: Orchestration with LangChain and LangGraph","Module 5: LLM Evaluation - hallucination detection, golden datasets, automated grading","Module 6: Safety Patterns - guardrails, content filtering, prompt-injection defense","Module 7: Production Deployment - FastAPI services, cost optimization, observability/tracing","Module 8: Capstone - build and deploy a production-grade GenAI copilot"],
      projects: ["Enterprise support copilot", "Document intelligence assistant"],
      officialResources: commonOfficialResources,
      youtubeLessons: buildYoutubeLessons("Generative AI Master Program"),
      lmsResources: buildLmsResources("Generative AI Master Program"),
      faqs: buildFaqs("Generative AI Master"),
      rating: 4.9,
      priceValue: 18999,
      originalPriceValue: 22999,
      highlight: "Flagship Program",
      tagLabel: "Most Popular",
      tagTone: "orange",
      certificate: "Generative AI Master Program Completion",
      icon: "sparkles",
      tags: ["GenAI", "LLM", "RAG", "Production"],
      officialSyllabusUrl: "https://learn.microsoft.com/azure/ai-services/openai/",
    }),
    createCourse({
      title: "Prompt Engineering and LLM Applications",
      slug: "prompt-engineering",
      track: "generative-ai",
      category: "ai",
      shortDescription: "Design high-quality prompts and practical LLM workflows for business and engineering use.",
      longDescription:
        "This course teaches systematic prompt engineering patterns, role-based prompting, output validation, and practical integration workflows for modern LLM tools.",
      level: "Intermediate",
      duration: "5 Weeks",
      mode: "self-paced",
      priceType: "one-time",
      certification: "GenZNext Prompt Engineering Credential",
      toolsCovered: ["OpenAI APIs", "Prompt templates", "Guardrails", "Function calling"],
      skillsYouWillLearn: ["Prompt design", "Response structuring", "LLM workflow testing", "Reliability patterns"],
      learningOutcomes: ["Create reliable prompts", "Build reusable LLM workflow templates", "Reduce hallucination risk"],
      targetAudience: ["Developers", "Business users", "Analysts"],
      prerequisites: ["Basic AI awareness"],
      syllabusModules: ["Module 1: Prompt Engineering Fundamentals - roles, context windows, and the 2026 model landscape","Module 2: Systematic Prompt Patterns - few-shot, chain-of-thought, self-consistency","Module 3: Structured Outputs and Function Calling for reliable LLM integrations","Module 4: Guardrails and Output Validation - reducing hallucination risk","Module 5: Prompt Testing and Versioning - building a reusable prompt library","Module 6: Workflow Integration - connecting prompts to real business applications","Module 7: Capstone - build a customer query assistant with a tested prompt library"],
      projects: ["Prompt operations library", "Customer query assistant"],
      officialResources: commonOfficialResources,
      youtubeLessons: buildYoutubeLessons("Prompt Engineering and LLM Applications"),
      lmsResources: buildLmsResources("Prompt Engineering and LLM Applications"),
      faqs: buildFaqs("Prompt Engineering"),
      rating: 4.7,
      priceValue: 12999,
      originalPriceValue: 16999,
      highlight: "Hands-on Prompt Labs",
      tagLabel: "Career Accelerator",
      tagTone: "blue",
      certificate: "Prompt Engineering and LLM Applications Completion",
      icon: "message",
      tags: ["Prompt Engineering", "LLM Apps", "GenAI"],
      officialSyllabusUrl: "https://platform.openai.com/docs/guides/prompt-engineering",
    }),
    createCourse({
      title: "RAG Applications with Vector Databases",
      slug: "rag-applications-vector-databases",
      track: "generative-ai",
      category: "ai",
      shortDescription: "Build retrieval-augmented applications using embeddings and vector search.",
      longDescription:
        "Focused training on data chunking, embedding pipelines, vector stores, retrieval quality, and grounded response generation for enterprise assistant use cases.",
      level: "Advanced",
      duration: "6 Weeks",
      mode: "self-paced",
      priceType: "one-time",
      certification: "GenZNext RAG Engineering Credential",
      toolsCovered: ["LangChain", "FAISS", "Chroma", "Embeddings APIs", "FastAPI"],
      skillsYouWillLearn: ["RAG architecture", "Embedding strategy", "Retrieval evaluation", "Latency optimization"],
      learningOutcomes: ["Build robust RAG pipelines", "Tune retrieval performance", "Deliver grounded AI answers"],
      targetAudience: ["LLM developers", "AI engineers", "Platform teams"],
      prerequisites: ["Python", "Basic LLM understanding"],
      syllabusModules: ["Module 1: RAG Architecture Fundamentals - when and why retrieval beats fine-tuning in 2026","Module 2: Data Chunking Strategies - semantic, recursive, and token-aware chunking","Module 3: Embeddings Deep Dive - model selection and embedding quality evaluation","Module 4: Vector Databases - FAISS, Chroma, and managed vector store options","Module 5: Retrieval Quality - hybrid search, re-ranking, and relevance tuning","Module 6: Grounded Generation - citation, source attribution, and reducing hallucination","Module 7: Latency and Cost Optimization for production RAG pipelines","Module 8: Capstone - build a policy-aware knowledge base assistant"],
      projects: ["Knowledge base assistant", "Policy-aware retrieval bot"],
      officialResources: commonOfficialResources,
      youtubeLessons: buildYoutubeLessons("RAG Applications with Vector Databases"),
      lmsResources: buildLmsResources("RAG Applications with Vector Databases"),
      faqs: buildFaqs("RAG Engineering"),
      rating: 4.8,
      priceValue: 18999,
      originalPriceValue: 22999,
      highlight: "Advanced Retrieval",
      tagLabel: "Builder Track",
      tagTone: "purple",
      certificate: "RAG Applications with Vector Databases Completion",
      icon: "database",
      tags: ["RAG", "Vector DB", "Embeddings"],
      officialSyllabusUrl: "https://learn.microsoft.com/azure/search/",
    }),
  ];

  const agenticCourses: Course[] = [
    createCourse({
      title: "Agentic AI Engineering",
      slug: "agentic-ai-engineering",
      track: "agentic-ai",
      category: "ai",
      shortDescription: "Design and deploy tool-using autonomous AI agent systems.",
      longDescription:
        "This advanced program covers planning loops, memory, tool orchestration, workflow governance, and reliability patterns for production-ready agentic applications.",
      level: "Advanced",
      duration: "8 Weeks",
      mode: "self-paced",
      priceType: "one-time",
      certification: "GenZNext Agentic AI Engineering Credential",
      toolsCovered: ["LangChain", "LangGraph", "OpenAI APIs", "Vector Databases", "Tracing tools"],
      skillsYouWillLearn: ["Agent architecture", "Tool orchestration", "State management", "Execution reliability"],
      learningOutcomes: ["Build multi-step AI agents", "Implement safe tool-use patterns", "Monitor agent decisions"],
      targetAudience: ["AI engineers", "GenAI developers", "Automation teams"],
      prerequisites: ["GenAI basics", "Python", "API integration experience"],
      syllabusModules: ["Module 1: Agentic AI Fundamentals - what makes a system an agent in 2026","Module 2: Planning Loops and Reasoning - ReAct, plan-and-execute patterns","Module 3: Memory Systems - short-term context, long-term vector memory","Module 4: Tool Orchestration - function calling, tool registries, API integration","Module 5: Multi-Step State Management with LangGraph","Module 6: Reliability and Guardrails - safe tool-use, human-in-the-loop checkpoints","Module 7: Observability - tracing agent decisions and debugging failures","Module 8: Capstone - build a research or operations automation agent"],
      projects: ["Research agent workflow", "Operations automation agent"],
      officialResources: commonOfficialResources,
      youtubeLessons: buildYoutubeLessons("Agentic AI Engineering"),
      lmsResources: buildLmsResources("Agentic AI Engineering"),
      faqs: buildFaqs("Agentic AI Engineering"),
      rating: 4.8,
      priceValue: 18999,
      originalPriceValue: 22999,
      highlight: "Advanced Engineering",
      tagLabel: "Enterprise Ready",
      tagTone: "blue",
      certificate: "Agentic AI Engineering Completion",
      icon: "brain",
      tags: ["Agentic AI", "Automation", "LLM Systems"],
      officialSyllabusUrl: "https://docs.github.com/en/copilot",
    }),
    createCourse({
      title: "LangChain and Multi-Agent Workflows",
      slug: "langchain-multi-agent-workflows",
      track: "agentic-ai",
      category: "ai",
      shortDescription: "Build orchestrated multi-agent pipelines with planning and tool collaboration.",
      longDescription:
        "A project-centric course focused on chaining agents, passing context, implementing tool access, and measuring output quality in multi-agent systems.",
      level: "Advanced",
      duration: "6 Weeks",
      mode: "self-paced",
      priceType: "one-time",
      certification: "GenZNext Multi-Agent Workflow Credential",
      toolsCovered: ["LangChain", "LangGraph", "OpenAI APIs", "Prompt templates", "Observability tools"],
      skillsYouWillLearn: ["Workflow orchestration", "Agent communication", "Prompt contracts", "Debugging agent chains"],
      learningOutcomes: ["Orchestrate multi-agent workflows", "Debug context handoffs", "Increase agent reliability"],
      targetAudience: ["AI builders", "Developers", "Automation architects"],
      prerequisites: ["Intermediate Python", "LLM basics"],
      syllabusModules: ["Module 1: Multi-Agent System Design - when to use one agent vs many","Module 2: Agent Communication Protocols and Context Passing","Module 3: Orchestration Frameworks - LangGraph multi-agent graphs","Module 4: Tool Access and Permissioning across agent roles","Module 5: Prompt Contracts - defining reliable agent-to-agent interfaces","Module 6: Debugging Agent Chains - tracing, replay, and failure isolation","Module 7: Capstone - build a multi-agent analyst or ticket-triage workflow"],
      projects: ["Multi-agent analyst assistant", "Ticket triage workflow"],
      officialResources: commonOfficialResources,
      youtubeLessons: buildYoutubeLessons("LangChain and Multi-Agent Workflows"),
      lmsResources: buildLmsResources("LangChain and Multi-Agent Workflows"),
      faqs: buildFaqs("Multi-Agent Workflows"),
      rating: 4.7,
      priceValue: 18999,
      originalPriceValue: 22999,
      highlight: "Deep Workflow Design",
      tagLabel: "High Demand",
      tagTone: "orange",
      certificate: "LangChain and Multi-Agent Workflows Completion",
      icon: "layers",
      tags: ["LangChain", "Multi-Agent", "Orchestration"],
      officialSyllabusUrl: "https://python.langchain.com/docs/introduction/",
    }),
    createCourse({
      title: "AI Agents for Enterprise Automation",
      slug: "ai-agents-enterprise-automation",
      track: "agentic-ai",
      category: "ai",
      shortDescription: "Create enterprise-ready AI agents for support, ops, and internal knowledge workflows.",
      longDescription:
        "A practical enterprise-focused track that combines governance, integrations, retrieval, and agent execution strategies for scalable automation outcomes.",
      level: "Intermediate",
      duration: "6 Weeks",
      mode: "self-paced",
      priceType: "one-time",
      certification: "GenZNext Enterprise Agent Automation Credential",
      toolsCovered: ["OpenAI APIs", "Workflow engines", "Vector stores", "Webhook connectors", "Policy controls"],
      skillsYouWillLearn: ["Enterprise agent patterns", "System integration", "Policy-aware automation", "ROI-driven design"],
      learningOutcomes: ["Automate internal operations with agents", "Integrate agents with enterprise tools", "Design measurable automation outcomes"],
      targetAudience: ["Working professionals", "Automation leads", "AI adopters"],
      prerequisites: ["Basic AI familiarity"],
      syllabusModules: ["Module 1: Enterprise Agent Patterns - governance, compliance, and ROI framing","Module 2: System Integration - connecting agents to internal tools via webhooks/APIs","Module 3: Vector Store Integration for enterprise knowledge retrieval","Module 4: Policy-Aware Automation - access control and audit trails","Module 5: Workflow Engines - orchestrating multi-step enterprise processes","Module 6: Measuring Automation ROI and rollout planning","Module 7: Capstone - build an internal helpdesk or SOP execution copilot"],
      projects: ["Internal helpdesk copilot", "SOP execution assistant"],
      officialResources: commonOfficialResources,
      youtubeLessons: buildYoutubeLessons("AI Agents for Enterprise Automation"),
      lmsResources: buildLmsResources("AI Agents for Enterprise Automation"),
      faqs: buildFaqs("Enterprise Agent Automation"),
      rating: 4.7,
      priceValue: 12999,
      originalPriceValue: 16999,
      highlight: "Enterprise Use Cases",
      tagLabel: "Applied Track",
      tagTone: "purple",
      certificate: "AI Agents for Enterprise Automation Completion",
      icon: "briefcase",
      tags: ["AI Agents", "Enterprise", "Automation"],
      officialSyllabusUrl: "https://learn.microsoft.com/azure/architecture/ai-ml/",
    }),
  ];

  const devsecopsCourses: Course[] = [
    createCourse({
      title: "DevSecOps Foundation",
      slug: "devsecops-foundation",
      track: "devsecops",
      category: "devops",
      shortDescription: "Learn secure CI/CD foundations, cloud security controls, and policy-aware delivery.",
      longDescription:
        "DevSecOps Foundation introduces security-first delivery pipelines, cloud hardening basics, and compliance-aware engineering workflows for modern teams.",
      level: "Beginner",
      duration: "6 Weeks",
      mode: "self-paced",
      priceType: "one-time",
      certification: "GenZNext DevSecOps Foundation Credential",
      toolsCovered: ["GitHub Actions", "Docker", "OWASP", "Trivy", "SonarQube"],
      skillsYouWillLearn: ["Secure SDLC basics", "Pipeline security checks", "Container hardening", "Vulnerability triage"],
      learningOutcomes: ["Implement baseline DevSecOps", "Run security checks in CI/CD", "Reduce release risk"],
      targetAudience: ["DevOps beginners", "Cloud engineers", "QA automation teams"],
      prerequisites: ["Basic CI/CD awareness"],
      syllabusModules: ["Module 1: DevSecOps Fundamentals - shifting security left in the SDLC","Module 2: Secure CI/CD Pipeline Design with GitHub Actions","Module 3: Container Hardening Basics with Docker (v29)","Module 4: Dependency and Vulnerability Scanning with Trivy","Module 5: Static Analysis with SonarQube","Module 6: OWASP Top 10 (2025 edition) - common vulnerabilities and mitigations","Module 7: Capstone - build a secure CI/CD pipeline baseline with automated checks"],
      projects: ["Secure pipeline baseline", "Container security policy checks"],
      officialResources: commonOfficialResources,
      youtubeLessons: buildYoutubeLessons("DevSecOps Foundation"),
      lmsResources: buildLmsResources("DevSecOps Foundation"),
      faqs: buildFaqs("DevSecOps Foundation"),
      rating: 4.7,
      priceValue: 8999,
      originalPriceValue: 12999,
      highlight: "Security First",
      tagLabel: "Core Track",
      tagTone: "green",
      certificate: "DevSecOps Foundation Completion",
      icon: "shield",
      tags: ["DevSecOps", "Security", "CI/CD"],
      officialSyllabusUrl: "https://owasp.org/www-project-top-ten/",
    }),
    createCourse({
      title: "CI/CD Security with GitHub Actions",
      slug: "ci-cd-pipeline-engineering",
      track: "devsecops",
      category: "devops",
      shortDescription: "Build secure, policy-gated CI/CD workflows using GitHub Actions.",
      longDescription:
        "This course focuses on pipeline threat modeling, secret protection, dependency scanning, and secure deployment controls in GitHub Actions workflows.",
      level: "Intermediate",
      duration: "6 Weeks",
      mode: "self-paced",
      priceType: "one-time",
      certification: "GenZNext CI/CD Security Credential",
      toolsCovered: ["GitHub Actions", "Dependabot", "CodeQL", "SAST/DAST", "Artifact signing"],
      skillsYouWillLearn: ["Pipeline threat modeling", "Secure workflow design", "Automated security checks", "Release governance"],
      learningOutcomes: ["Harden CI/CD workflows", "Automate security controls", "Deploy with compliance gates"],
      targetAudience: ["DevOps engineers", "Security engineers", "Platform teams"],
      prerequisites: ["Git basics", "CI/CD fundamentals"],
      syllabusModules: ["Module 1: Pipeline Threat Modeling - identifying CI/CD attack surfaces","Module 2: GitHub Actions Security Hardening - OIDC, least-privilege tokens","Module 3: Secret Protection and Management in workflows","Module 4: Dependency Scanning with Dependabot and CodeQL","Module 5: SAST/DAST Integration in automated pipelines","Module 6: Artifact Signing and Supply Chain Security (SLSA, Sigstore)","Module 7: Release Governance - policy gates and compliance checkpoints","Module 8: Capstone - end-to-end secure, policy-gated CI/CD workflow"],
      projects: ["End-to-end secure CI/CD workflow", "Policy-gated deployment pipeline"],
      officialResources: commonOfficialResources,
      youtubeLessons: buildYoutubeLessons("CI/CD Security with GitHub Actions"),
      lmsResources: buildLmsResources("CI/CD Security with GitHub Actions"),
      faqs: buildFaqs("CI/CD Security"),
      rating: 4.8,
      priceValue: 12999,
      originalPriceValue: 16999,
      highlight: "Pipeline Security",
      tagLabel: "Professional",
      tagTone: "blue",
      certificate: "CI/CD Security with GitHub Actions Completion",
      icon: "gitBranch",
      tags: ["GitHub Actions", "CI/CD", "Security"],
      officialSyllabusUrl: "https://docs.github.com/en/actions/security-guides",
    }),
    createCourse({
      title: "Kubernetes Security and Observability",
      slug: "docker-kubernetes",
      track: "devsecops",
      category: "devops",
      shortDescription: "Secure Kubernetes workloads and implement production observability practices.",
      longDescription:
        "A practical cloud-native security course focused on Kubernetes hardening, runtime controls, monitoring, logging, and incident-ready observability.",
      level: "Advanced",
      duration: "8 Weeks",
      mode: "self-paced",
      priceType: "one-time",
      certification: "GenZNext Kubernetes Security Credential",
      toolsCovered: ["Kubernetes", "Prometheus", "Grafana", "Falco", "Helm", "OPA"],
      skillsYouWillLearn: ["Cluster hardening", "Runtime security", "Observability design", "Alert triage"],
      learningOutcomes: ["Secure Kubernetes clusters", "Implement monitoring and logging", "Improve incident response posture"],
      targetAudience: ["Platform engineers", "SREs", "DevSecOps professionals"],
      prerequisites: ["Container fundamentals", "Basic Kubernetes operations"],
      syllabusModules: ["Module 1: Kubernetes 1.36 Architecture and Cluster Hardening Basics","Module 2: RBAC, Network Policies, and Pod Security Standards","Module 3: Runtime Security with Falco","Module 4: Policy Enforcement with OPA/Gatekeeper","Module 5: Observability Stack - Prometheus, Grafana, and Loki","Module 6: Helm Chart Security and Supply Chain Hardening","Module 7: Incident Response and Alert Triage for Kubernetes workloads","Module 8: Capstone - secure deployment baseline with full observability stack"],
      projects: ["Secure Kubernetes deployment baseline", "Observability stack implementation"],
      officialResources: commonOfficialResources,
      youtubeLessons: buildYoutubeLessons("Kubernetes Security and Observability"),
      lmsResources: buildLmsResources("Kubernetes Security and Observability"),
      faqs: buildFaqs("Kubernetes Security"),
      rating: 4.8,
      priceValue: 18999,
      originalPriceValue: 22999,
      highlight: "Cloud Native Security",
      tagLabel: "Advanced",
      tagTone: "orange",
      certificate: "Kubernetes Security and Observability Completion",
      icon: "layers",
      tags: ["Kubernetes", "Observability", "DevSecOps"],
      officialSyllabusUrl: "https://kubernetes.io/docs/concepts/security/",
    }),
  ];

  const awsCourses: Course[] = [
    createCourse({
      title: "AWS Cloud Practitioner",
      slug: "aws-cloud-practitioner",
      track: "aws-certifications",
      category: "aws",
      shortDescription: "Beginner-friendly AWS cloud fundamentals aligned to CLF-C02.",
      longDescription:
        "This certification-focused course covers AWS core services, pricing, security, and cloud concepts to prepare learners for the AWS Cloud Practitioner exam.",
      level: "Beginner",
      duration: "5 Weeks",
      mode: "self-paced",
      priceType: "one-time",
      certification: "CLF-C02",
      toolsCovered: ["AWS Console", "EC2", "S3", "IAM", "CloudWatch", "Billing"],
      skillsYouWillLearn: ["Cloud fundamentals", "AWS core services", "Security basics", "Exam readiness"],
      learningOutcomes: ["Understand AWS foundations", "Navigate AWS console confidently", "Prepare for CLF-C02"],
      targetAudience: ["Beginners", "Students", "IT support professionals"],
      prerequisites: ["No prior AWS experience required"],
      syllabusModules: ["Module 1: Cloud Computing Concepts - IaaS/PaaS/SaaS and the AWS global footprint","Module 2: Core AWS Services - EC2, S3, VPC basics, IAM fundamentals","Module 3: AWS Pricing, Billing and Cost Management tools","Module 4: Security and Compliance Basics - Shared Responsibility Model","Module 5: Monitoring with CloudWatch","Module 6: CLF-C02 Exam Domains Review and Practice Questions","Module 7: Capstone - cloud cost estimation and AWS service-mapping exercise"],
      projects: ["Cloud cost estimation worksheet", "AWS service mapping exercise"],
      officialResources: commonOfficialResources,
      youtubeLessons: buildYoutubeLessons("AWS Cloud Practitioner"),
      lmsResources: buildLmsResources("AWS Cloud Practitioner"),
      faqs: buildFaqs("CLF-C02"),
      rating: 4.7,
      priceValue: 8999,
      originalPriceValue: 12999,
      highlight: "Certification Starter",
      tagLabel: "Beginner",
      tagTone: "green",
      certificate: "AWS Cloud Practitioner Course Completion",
      icon: "cloud",
      tags: ["AWS", "CLF-C02", "Cloud Basics"],
      officialSyllabusUrl: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
    }),
    createCourse({
      title: "AWS Solutions Architect Associate",
      slug: "aws-solutions-architect",
      track: "aws-certifications",
      category: "aws",
      shortDescription: "Design secure, scalable AWS architectures aligned to SAA-C03.",
      longDescription:
        "A role-based architecture program covering networking, compute, storage, resilience, and best-practice design trade-offs for AWS Solutions Architect Associate.",
      level: "Intermediate",
      duration: "8 Weeks",
      mode: "self-paced",
      priceType: "one-time",
      certification: "SAA-C03",
      toolsCovered: ["VPC", "Route 53", "ALB", "RDS", "Lambda", "CloudFormation"],
      skillsYouWillLearn: ["Architecture design", "High availability", "Cost optimization", "Security by design"],
      learningOutcomes: ["Design AWS architectures", "Plan resilient systems", "Prepare for SAA-C03 exam"],
      targetAudience: ["Cloud engineers", "Developers", "System administrators"],
      prerequisites: ["Basic AWS knowledge"],
      syllabusModules: ["Module 1: AWS Networking - VPC design, subnets, routing, Route 53","Module 2: Compute and Load Balancing - EC2, Auto Scaling, ALB/NLB","Module 3: Storage and Database Architecture - S3, EBS, RDS, DynamoDB","Module 4: High Availability and Resilience - Multi-AZ, DR strategies","Module 5: Serverless Building Blocks - Lambda, API Gateway","Module 6: Infrastructure as Code with CloudFormation","Module 7: Cost Optimization and Well-Architected Framework","Module 8: SAA-C03 Exam Domains Review and Practice Scenarios","Module 9: Capstone - multi-tier resilient architecture design"],
      projects: ["Multi-tier architecture design", "Resilience and DR blueprint"],
      officialResources: commonOfficialResources,
      youtubeLessons: buildYoutubeLessons("AWS Solutions Architect Associate"),
      lmsResources: buildLmsResources("AWS Solutions Architect Associate"),
      faqs: buildFaqs("SAA-C03"),
      rating: 4.9,
      priceValue: 12999,
      originalPriceValue: 16999,
      highlight: "Top AWS Track",
      tagLabel: "Most Popular",
      tagTone: "orange",
      certificate: "AWS Solutions Architect Associate Completion",
      icon: "cloudCog",
      tags: ["AWS", "SAA-C03", "Architecture"],
      officialSyllabusUrl: "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
    }),
    createCourse({
      title: "AWS Developer Associate",
      slug: "aws-developer-associate",
      track: "aws-certifications",
      category: "aws",
      shortDescription: "Build and deploy cloud-native applications on AWS for DVA-C02 readiness.",
      longDescription:
        "Hands-on developer track covering SDK integrations, serverless patterns, application deployment, and observability for AWS Developer Associate.",
      level: "Intermediate",
      duration: "7 Weeks",
      mode: "self-paced",
      priceType: "one-time",
      certification: "DVA-C02",
      toolsCovered: ["Lambda", "API Gateway", "DynamoDB", "SQS", "CloudWatch", "CDK"],
      skillsYouWillLearn: ["Serverless development", "AWS SDK usage", "Deployment automation", "App monitoring"],
      learningOutcomes: ["Build AWS-native apps", "Deploy reliable services", "Prepare for DVA-C02"],
      targetAudience: ["Developers", "Backend engineers", "Cloud app builders"],
      prerequisites: ["Programming fundamentals", "Basic AWS concepts"],
      syllabusModules: ["Module 1: AWS SDK and CLI Development Workflow","Module 2: Serverless Application Development - Lambda, API Gateway, Step Functions","Module 3: Data Persistence - DynamoDB design patterns, SQS, SNS","Module 4: CI/CD for Developers - CodePipeline, CodeBuild, CDK","Module 5: Application Monitoring and Debugging with CloudWatch and X-Ray","Module 6: Security for Developers - IAM roles, KMS, Secrets Manager","Module 7: DVA-C02 Exam Domains Review and Practice Labs","Module 8: Capstone - event-driven serverless order-processing application"],
      projects: ["Serverless backend API", "Event-driven order processing app"],
      officialResources: commonOfficialResources,
      youtubeLessons: buildYoutubeLessons("AWS Developer Associate"),
      lmsResources: buildLmsResources("AWS Developer Associate"),
      faqs: buildFaqs("DVA-C02"),
      rating: 4.8,
      priceValue: 12999,
      originalPriceValue: 16999,
      highlight: "Developer Focused",
      tagLabel: "Role Based",
      tagTone: "blue",
      certificate: "AWS Developer Associate Completion",
      icon: "code",
      tags: ["AWS", "DVA-C02", "Serverless"],
      officialSyllabusUrl: "https://aws.amazon.com/certification/certified-developer-associate/",
    }),
    createCourse({
      title: "AWS DevOps Engineer Professional",
      slug: "aws-devops-engineer",
      track: "aws-certifications",
      category: "aws",
      shortDescription: "Advanced AWS DevSecOps and automation aligned to DOP-C02.",
      longDescription:
        "Professional-level track focused on deployment automation, observability, infrastructure-as-code, release governance, and DevSecOps delivery on AWS.",
      level: "Advanced",
      duration: "9 Weeks",
      mode: "self-paced",
      priceType: "one-time",
      certification: "DOP-C02",
      toolsCovered: ["CodePipeline", "CodeBuild", "ECS", "CloudWatch", "Terraform", "GitHub Actions"],
      skillsYouWillLearn: ["Release engineering", "Deployment pipelines", "Monitoring strategy", "IaC operations"],
      learningOutcomes: ["Lead AWS delivery pipelines", "Build reliable release systems", "Prepare for DOP-C02"],
      targetAudience: ["DevSecOps engineers", "Cloud architects", "SREs"],
      prerequisites: ["AWS Associate-level knowledge", "CI/CD experience"],
      syllabusModules: ["Module 1: Advanced CI/CD on AWS - CodePipeline, CodeBuild, ECS/EKS deployment","Module 2: Infrastructure as Code at Scale - Terraform and CloudFormation patterns","Module 3: Release Governance and Deployment Strategies (blue/green, canary)","Module 4: Monitoring, Logging and Observability - CloudWatch, X-Ray, OpenTelemetry","Module 5: Incident and Event Response Automation","Module 6: DevSecOps on AWS - GitHub Actions integration, policy as code","Module 7: DOP-C02 Exam Domains Review and Scenario-Based Practice","Module 8: Capstone - professional CI/CD platform with full observability"],
      projects: ["Professional CI/CD platform design", "Automated release with observability"],
      officialResources: commonOfficialResources,
      youtubeLessons: buildYoutubeLessons("AWS DevOps Engineer Professional"),
      lmsResources: buildLmsResources("AWS DevOps Engineer Professional"),
      faqs: buildFaqs("DOP-C02"),
      rating: 4.8,
      priceValue: 18999,
      originalPriceValue: 22999,
      highlight: "Professional Level",
      tagLabel: "Expert",
      tagTone: "purple",
      certificate: "AWS DevOps Engineer Professional Completion",
      icon: "shield",
      tags: ["AWS", "DOP-C02", "DevSecOps"],
      officialSyllabusUrl: "https://aws.amazon.com/certification/certified-devops-engineer-professional/",
    }),
  ];

  const azureCourses: Course[] = [
    createCourse({
      title: "Azure Fundamentals AZ-900",
      slug: "azure-fundamentals",
      track: "azure-certifications",
      category: "azure",
      shortDescription: "Start Azure confidently with AZ-900 certification-aligned learning.",
      longDescription:
        "A beginner certification track covering Azure cloud concepts, core services, governance, and pricing fundamentals with guided revision support.",
      level: "Beginner",
      duration: "5 Weeks",
      mode: "self-paced",
      priceType: "one-time",
      certification: "AZ-900",
      toolsCovered: ["Azure Portal", "Compute basics", "Storage basics", "Entra ID", "Pricing calculator"],
      skillsYouWillLearn: ["Cloud concepts", "Azure service awareness", "Basic governance", "Certification readiness"],
      learningOutcomes: ["Prepare for AZ-900", "Understand Azure basics", "Navigate Azure ecosystem"],
      targetAudience: ["Beginners", "Students", "Cloud aspirants"],
      prerequisites: ["No prior Azure experience needed"],
      syllabusModules: ["Module 1: Cloud Concepts - service models, Azure global infrastructure (60+ regions)","Module 2: Core Azure Services - Compute, Storage, Networking overview","Module 3: Microsoft Entra ID and Identity Fundamentals","Module 4: Azure Pricing, SLAs, and Cost Management","Module 5: Governance and Compliance Basics - Azure Policy, Blueprints","Module 6: AZ-900 Exam Domains Review and Practice Questions","Module 7: Capstone - Azure service comparison matrix and revision dashboard"],
      projects: ["Cloud service comparison matrix", "AZ-900 revision dashboard"],
      officialResources: commonOfficialResources,
      youtubeLessons: buildYoutubeLessons("Azure Fundamentals AZ-900"),
      lmsResources: buildLmsResources("Azure Fundamentals AZ-900"),
      faqs: buildFaqs("AZ-900"),
      rating: 4.7,
      priceValue: 8999,
      originalPriceValue: 12999,
      highlight: "Azure Starter",
      tagLabel: "Beginner",
      tagTone: "green",
      certificate: "Azure Fundamentals AZ-900 Completion",
      icon: "cloud",
      tags: ["Azure", "AZ-900", "Foundations"],
      officialSyllabusUrl: "https://learn.microsoft.com/certifications/azure-fundamentals/",
    }),
    createCourse({
      title: "Azure Administrator AZ-104",
      slug: "azure-administrator",
      track: "azure-certifications",
      category: "azure",
      shortDescription: "Master day-to-day Azure administration workflows and services.",
      longDescription:
        "A practical administrator pathway focused on identity, compute, networking, storage, and monitoring aligned to Azure Administrator AZ-104 outcomes.",
      level: "Intermediate",
      duration: "8 Weeks",
      mode: "self-paced",
      priceType: "one-time",
      certification: "AZ-104",
      toolsCovered: ["Azure Portal", "Entra ID", "VMs", "VNet", "Storage Accounts", "Azure Monitor"],
      skillsYouWillLearn: ["Azure administration", "Identity and access", "Monitoring operations", "Resource governance"],
      learningOutcomes: ["Manage Azure infrastructure", "Apply admin best practices", "Prepare for AZ-104"],
      targetAudience: ["System admins", "Cloud engineers", "IT professionals"],
      prerequisites: ["Basic cloud concepts"],
      syllabusModules: ["Module 1: Azure Identity and Governance - Entra ID, RBAC, Management Groups","Module 2: Azure Compute - Virtual Machines, Scale Sets, App Service basics","Module 3: Virtual Networking - VNets, NSGs, Load Balancers, Peering","Module 4: Storage Accounts - Blob, Files, redundancy options","Module 5: Monitoring with Azure Monitor and Log Analytics","Module 6: Backup, Recovery and Resource Governance","Module 7: AZ-104 Exam Domains Review and Hands-on Labs","Module 8: Capstone - Azure operations baseline with monitoring and alerting"],
      projects: ["Azure operations baseline", "Monitoring and alerting implementation"],
      officialResources: commonOfficialResources,
      youtubeLessons: buildYoutubeLessons("Azure Administrator AZ-104"),
      lmsResources: buildLmsResources("Azure Administrator AZ-104"),
      faqs: buildFaqs("AZ-104"),
      rating: 4.8,
      priceValue: 20000,
      originalPriceValue: 20000,
      highlight: "Career Track",
      tagLabel: "Most Popular",
      tagTone: "orange",
      certificate: "Azure Administrator AZ-104 Completion",
      icon: "cloudCog",
      tags: ["Azure", "AZ-104", "Admin"],
      officialSyllabusUrl: "/syllabus/az-104-official-syllabus.pdf",
    }),
    createCourse({
      title: "Azure Developer AZ-204",
      slug: "azure-developer-az-204",
      track: "azure-certifications",
      category: "azure",
      shortDescription: "Develop and deploy Azure cloud applications aligned to AZ-204.",
      longDescription:
        "Developer-focused Azure training covering application services, event-driven integration, storage patterns, and monitoring practices for AZ-204 readiness.",
      level: "Intermediate",
      duration: "7 Weeks",
      mode: "self-paced",
      priceType: "one-time",
      certification: "AZ-204",
      toolsCovered: ["App Service", "Functions", "Event Grid", "Cosmos DB", "Key Vault", "Application Insights"],
      skillsYouWillLearn: ["Cloud app development", "Serverless integration", "Monitoring and diagnostics", "Secure app deployment"],
      learningOutcomes: ["Build Azure cloud applications", "Integrate platform services", "Prepare for AZ-204"],
      targetAudience: ["Developers", "Backend engineers", "Application teams"],
      prerequisites: ["Programming basics", "Azure fundamentals"],
      syllabusModules: ["Module 1: Azure App Service and Container-Based Compute for Developers","Module 2: Azure Functions and Event-Driven Architecture (Event Grid, Event Hubs)","Module 3: Data Storage for Developers - Cosmos DB, Blob Storage SDKs","Module 4: Security - Key Vault, Managed Identities, authentication patterns","Module 5: API Development and Management with Azure API Management","Module 6: Monitoring and Diagnostics with Application Insights","Module 7: AZ-204 Exam Domains Review and Hands-on Labs","Module 8: Capstone - serverless Azure API platform with full observability"],
      projects: ["Serverless Azure API platform", "Cloud-native integration workflow"],
      officialResources: commonOfficialResources,
      youtubeLessons: buildYoutubeLessons("Azure Developer AZ-204"),
      lmsResources: buildLmsResources("Azure Developer AZ-204"),
      faqs: buildFaqs("AZ-204"),
      rating: 4.8,
      priceValue: 12999,
      originalPriceValue: 16999,
      highlight: "Developer Pathway",
      tagLabel: "Role Based",
      tagTone: "blue",
      certificate: "Azure Developer AZ-204 Completion",
      icon: "code",
      tags: ["Azure", "AZ-204", "Developer"],
      officialSyllabusUrl: "https://learn.microsoft.com/certifications/azure-developer/",
    }),
    createCourse({
      title: "Azure Solutions Architect AZ-305",
      slug: "azure-solutions-architect",
      track: "azure-certifications",
      category: "azure",
      shortDescription: "Design enterprise-grade Azure architectures for AZ-305 certification.",
      longDescription:
        "Advanced architecture journey focused on security, governance, hybrid cloud, high availability, and scalable system design aligned to AZ-305.",
      level: "Advanced",
      duration: "9 Weeks",
      mode: "self-paced",
      priceType: "one-time",
      certification: "AZ-305",
      toolsCovered: ["Azure Architecture Center", "VNet", "AKS", "Identity", "Governance", "DR planning"],
      skillsYouWillLearn: ["Architecture decision making", "Hybrid design", "Security architecture", "Cost-aware planning"],
      learningOutcomes: ["Design Azure enterprise architecture", "Present architecture trade-offs", "Prepare for AZ-305"],
      targetAudience: ["Cloud architects", "Senior engineers", "Technical leads"],
      prerequisites: ["AZ-104 level understanding"],
      syllabusModules: ["Module 1: Architecture Fundamentals - Azure Well-Architected Framework","Module 2: Identity and Security Architecture - Entra ID, Zero Trust design","Module 3: Hybrid and Multi-Cloud Design Patterns","Module 4: High Availability, Scalability and Disaster Recovery Planning","Module 5: Data Architecture - storage, databases, and analytics design choices","Module 6: Networking Architecture - VNet topologies, AKS, hub-and-spoke design","Module 7: Cost-Aware Architecture and Governance at Enterprise Scale","Module 8: AZ-305 Exam Domains Review and Case Study Practice","Module 9: Capstone - enterprise reference architecture with DR plan"],
      projects: ["Enterprise reference architecture", "Disaster recovery architecture plan"],
      officialResources: commonOfficialResources,
      youtubeLessons: buildYoutubeLessons("Azure Solutions Architect AZ-305"),
      lmsResources: buildLmsResources("Azure Solutions Architect AZ-305"),
      faqs: buildFaqs("AZ-305"),
      rating: 4.9,
      priceValue: 18999,
      originalPriceValue: 22999,
      highlight: "Enterprise Architecture",
      tagLabel: "Advanced",
      tagTone: "purple",
      certificate: "Azure Solutions Architect AZ-305 Completion",
      icon: "topology",
      tags: ["Azure", "AZ-305", "Architecture"],
      officialSyllabusUrl: "https://learn.microsoft.com/certifications/azure-solutions-architect/",
    }),
    createCourse({
      title: "Azure DevOps Engineer AZ-400",
      slug: "azure-devops-engineer",
      track: "azure-certifications",
      category: "azure",
      shortDescription: "Build secure Azure and GitHub delivery pipelines aligned to AZ-400.",
      longDescription:
        "Professional Azure DevSecOps track focused on source control strategy, CI/CD architecture, release governance, observability, and AZ-400 exam outcomes.",
      level: "Advanced",
      duration: "8 Weeks",
      mode: "self-paced",
      priceType: "one-time",
      certification: "AZ-400",
      toolsCovered: ["Azure DevOps", "GitHub Actions", "Pipelines", "Boards", "Repos", "Azure Monitor"],
      skillsYouWillLearn: ["DevSecOps planning", "Pipeline automation", "Release controls", "Monitoring strategy"],
      learningOutcomes: ["Implement Azure DevSecOps pipelines", "Improve release reliability", "Prepare for AZ-400"],
      targetAudience: ["DevOps engineers", "Platform engineers", "Cloud teams"],
      prerequisites: ["Azure admin basics", "CI/CD understanding"],
      syllabusModules: ["Module 1: DevOps Planning - source control strategy, branching models","Module 2: CI/CD Pipeline Architecture with Azure Pipelines and GitHub Actions","Module 3: Infrastructure as Code - ARM/Bicep and Terraform on Azure","Module 4: Release Governance and Approval Gates","Module 5: Monitoring and Feedback Loops with Azure Monitor","Module 6: Security Integration - secret scanning, policy as code, SAST/DAST","Module 7: AZ-400 Exam Domains Review and Scenario-Based Practice","Module 8: Capstone - enterprise release pipeline with secure IaC deployment"],
      projects: ["Enterprise release pipeline", "Secure IaC deployment workflow"],
      officialResources: commonOfficialResources,
      youtubeLessons: buildYoutubeLessons("Azure DevOps Engineer AZ-400"),
      lmsResources: buildLmsResources("Azure DevOps Engineer AZ-400"),
      faqs: buildFaqs("AZ-400"),
      rating: 4.8,
      priceValue: 30000,
      originalPriceValue: 30000,
      highlight: "Professional Delivery",
      tagLabel: "Industry Ready",
      tagTone: "blue",
      certificate: "Azure DevOps Engineer AZ-400 Completion",
      icon: "shield",
      tags: ["Azure", "AZ-400", "DevSecOps"],
      officialSyllabusUrl: "https://learn.microsoft.com/certifications/devops-engineer/",
    }),

    createCourse({
      title: "AIOps Engineering",
      slug: "aiops-engineering",
      track: "devsecops",
      category: "devops",
      shortDescription: "Build observability, automation, and incident-response workflows for modern cloud operations teams.",
      longDescription:
        "AIOps Engineering is a production-focused track built around Azure Monitor, Log Analytics, KQL, alerting, runbook automation, and reliability operations. It helps platform, SRE, and cloud support teams move from reactive monitoring to structured incident intelligence and automated response workflows.",
      level: "Advanced",
      duration: "8 Weeks",
      mode: "self-paced",
      priceType: "one-time",
      certification: "AIOps Capstone Portfolio",
      toolsCovered: ["Azure Monitor", "Log Analytics", "Application Insights", "KQL", "Workbooks", "Alerts", "Azure Automation", "Logic Apps"],
      skillsYouWillLearn: ["Observability design", "KQL analysis", "Incident triage", "Runbook automation", "Reliability operations"],
      learningOutcomes: ["Build observability workflows", "Automate incident response", "Create production AIOps playbooks"],
      targetAudience: ["SRE engineers", "Platform operations teams", "Cloud support engineers"],
      prerequisites: ["Basic cloud operations understanding", "Familiarity with monitoring concepts"],
      syllabusModules: ["Module 1: AIOps Foundations - observability strategy and incident intelligence for cloud teams","Module 2: Azure Monitor and Log Analytics - collecting, querying, and correlating telemetry","Module 3: KQL for Operations - incident analysis, alert tuning, and diagnostics workflows","Module 4: Dashboards and Workbooks - building actionable operations views","Module 5: Alerting and Action Groups - reducing noise and improving response quality","Module 6: Azure Automation and Logic Apps - runbook automation for repeatable incident handling","Module 7: Reliability Operations - service health, incident response, and support handoff workflows","Module 8: Capstone - build an AIOps operations hub with alerts, dashboards, and automation"],
      projects: ["AIOps operations hub", "Incident automation workflow", "Observability dashboard portfolio"],
      officialResources: commonOfficialResources,
      youtubeLessons: buildYoutubeLessons("AIOps Engineering"),
      lmsResources: buildLmsResources("AIOps Engineering"),
      faqs: buildFaqs("AIOps Engineering"),
      rating: 4.8,
      priceValue: 40000,
      originalPriceValue: 40000,
      highlight: "Operations Intelligence",
      tagLabel: "Cloud Operations AI",
      tagTone: "purple",
      certificate: "AIOps Engineering Completion",
      icon: "shield",
      tags: ["AIOps", "Observability", "Incident Response"],
      officialSyllabusUrl: "https://learn.microsoft.com/azure/azure-monitor/",
    }),
  ];

  return {
    aws: awsCourses,
    azure: azureCourses,
    ai: [...aiCourses, ...genAiCourses, ...agenticCourses],
    devops: devsecopsCourses,
  };
}

export const coursesByCategory: Record<CourseCategoryKey, Course[]> = buildCourseData();

export const courseCategories = [
  {
    key: "aws",
    title: "AWS Certifications",
    description: "Role-based AWS certification learning tracks from foundation to professional level.",
    href: "/courses/aws",
    gradient: "from-[#7C2D12] via-[#4F46E5] to-[#7C3AED]",
  },
  {
    key: "azure",
    title: "Azure Certifications",
    description: "Microsoft-aligned certification pathways for administrators, developers, architects, and DevSecOps engineers.",
    href: "/courses/azure",
    gradient: "from-[#7C2D12] via-[#4F46E5] to-[#7C3AED]",
  },
  {
    key: "ai",
    title: "AI, Generative AI & Agentic AI",
    description: "Practical AI tracks with project-based, certification-focused, and production-oriented outcomes.",
    href: "/courses/ai",
    gradient: "from-[#7C2D12] via-[#4F46E5] to-[#7C3AED]",
  },
  {
    key: "devops",
    title: "DevSecOps",
    description: "Secure CI/CD, cloud-native operations, Kubernetes hardening, and enterprise automation pathways.",
    href: "/courses/devops",
    gradient: "from-[#7C2D12] via-[#4F46E5] to-[#7C3AED]",
  },
] as const;

export type CategoryExperienceContent = {
  metadataDescription: string;
  sectionEyebrow: string;
  sectionTitle: string;
  sectionDescription: string;
};

export const categoryExperienceContent: Record<CourseCategoryKey, CategoryExperienceContent> = {
  aws: {
    metadataDescription: "AWS certification-ready courses with mentor-led projects, revision support, and practical cloud delivery.",
    sectionEyebrow: "AWS CERTIFICATIONS",
    sectionTitle: "Build your AWS certification and cloud engineering pathway",
    sectionDescription: "From Cloud Practitioner to DevOps Engineer Professional, these tracks are designed for practical, role-oriented career growth.",
  },
  azure: {
    metadataDescription: "Azure certification tracks for beginners and professionals across admin, developer, architect, and DevSecOps roles.",
    sectionEyebrow: "AZURE CERTIFICATIONS",
    sectionTitle: "Prepare for AZ-900, AZ-104, AZ-204, AZ-305, and AZ-400 with confidence",
    sectionDescription: "Structured Azure learning paths with labs, official docs, and certification preparation support.",
  },
  ai: {
    metadataDescription: "AI, Generative AI, and Agentic AI programs with project-driven practical outcomes and LMS resources.",
    sectionEyebrow: "AI LEARNING TRACKS",
    sectionTitle: "Master practical AI, GenAI, and agentic systems with project-based learning",
    sectionDescription: "Move from fundamentals to advanced implementation with structured modules, mentor guidance, and portfolio-focused outputs.",
  },
  devops: {
    metadataDescription: "DevSecOps programs for secure software delivery, pipeline hardening, and cloud-native observability.",
    sectionEyebrow: "DEVSECOPS TRACKS",
    sectionTitle: "Design secure CI/CD and production-ready cloud delivery systems",
    sectionDescription: "Build security-first automation skills across GitHub Actions, Kubernetes security, and enterprise pipeline workflows.",
  },
};

export function getCategoryExperienceContent(category: string) {
  if (category in categoryExperienceContent) {
    return categoryExperienceContent[category as CourseCategoryKey];
  }
  return null;
}

export const allCourses = Object.values(coursesByCategory).flat();

export function getCategoryData(category: string) {
  return courseCategories.find((item) => item.key === category);
}



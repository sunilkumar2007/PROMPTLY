export interface ExtractedRequirementItem {
  id: string;
  category: "module" | "feature" | "database" | "api" | "auth" | "security" | "ui_ux" | "integration" | "testing" | "deployment" | "non_functional";
  title: string;
  description: string;
  importance: "high" | "medium" | "low";
}

export interface RequirementQuestion {
  id: string;
  question: string;
  options: string[];
  selectedAnswer?: string;
}

export interface ExtractedRequirements {
  projectName: string;
  objective: string;
  targetUsers: string[];
  functionalRequirements: string[];
  nonFunctionalRequirements: string[];
  modules: string[];
  techStack: string[];
  database: string[];
  apis: string[];
  auth: string[];
  security: string[];
  uiUx: string[];
  integrations: string[];
  constraints: string[];
  items: ExtractedRequirementItem[];
}

export interface PromptVersion {
  version: number;
  promptText: string;
  createdAt: string;
  notes?: string;
}

export interface ProjectPhase {
  id: string;
  phaseNumber: number;
  title: string;
  objective: string;
  description: string;
  requirementsCovered: string[];
  dependencies: number[]; // Phase numbers this phase depends on
  prerequisites: string[];
  expectedOutput: string;
  filesAffected: {
    create: string[];
    modify: string[];
    doNotBreak: string[];
  };
  technologies: string[];
  complexity: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  completionCriteria: string[];
  prompt: string;
  versions: PromptVersion[];
  currentVersion: number;
  status: "Not Started" | "In Progress" | "Completed";
  generationStatus?: "waiting" | "generating" | "completed" | "failed";
  updatedAt: string;
}

export interface ImpactAnalysisResult {
  modifiedRequirement: string;
  affectedPhaseIds: string[];
  summary: string;
  suggestedAction: string;
}

export interface SoftwareProject {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: "DRAFT_PROMPT_GEN" | "READY_TO_BUILD";
  targetAiModel?: string;
  referenceImageUrl?: string;
  referenceImageName?: string;
  rawDocumentName?: string;
  rawDocumentContent?: string;
  requirements: ExtractedRequirements;
  questions: RequirementQuestion[];
  userAnswers: Record<string, string>;
  requirementsConfirmed: boolean;
  granularity: number; // 5, 10, 15, 20, 30, 50, 100, custom
  phases: ProjectPhase[];
  impactAnalysis?: ImpactAnalysisResult | null;
  progress: number; // 0 to 100
}

const STORAGE_KEY = "promptly_software_projects_v1";

export function loadProjectsFromStorage(): SoftwareProject[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : getInitialMockProjects();
  } catch (e) {
    console.error("Failed to load software projects from storage:", e);
    return getInitialMockProjects();
  }
}

export function saveProjectsToStorage(projects: SoftwareProject[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error("Failed to save software projects to storage:", e);
  }
}

function getInitialMockProjects(): SoftwareProject[] {
  return [
    {
      id: "project-ecommerce-demo",
      name: "E-Commerce Micro-SaaS Platform",
      description: "Full-stack multi-tenant e-commerce platform with automated invoicing, inventory tracking, Stripe payments, and real-time analytics.",
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      status: "READY_TO_BUILD",
      targetAiModel: "Claude 3.5 Sonnet",
      rawDocumentName: "Ecommerce_SRS_v2.md",
      rawDocumentContent: "# SRS: E-Commerce Micro-SaaS Platform\n\nBuild a complete modern multi-tenant e-commerce platform with Next.js, Node.js, PostgreSQL, Stripe, and Tailwind CSS.",
      requirementsConfirmed: true,
      granularity: 5,
      questions: [
        { id: "q1", question: "Which database engine should be used?", options: ["PostgreSQL", "MySQL", "MongoDB"], selectedAnswer: "PostgreSQL" },
        { id: "q2", question: "Which authentication strategy?", options: ["JWT", "OAuth2", "Both"], selectedAnswer: "JWT" }
      ],
      userAnswers: {
        "Which database engine should be used?": "PostgreSQL",
        "Which authentication strategy?": "JWT"
      },
      progress: 40,
      requirements: {
        projectName: "E-Commerce Micro-SaaS Platform",
        objective: "Provide small business merchants with modular digital storefronts and automated order fulfillment.",
        targetUsers: ["Store Merchants", "Customers", "Super Admin"],
        functionalRequirements: [
          "Merchant onboarding and domain configuration",
          "Product catalog with variant management",
          "Cart session management & checkout pipeline",
          "Stripe webhook payment processing & order status automation",
          "Admin analytics dashboard"
        ],
        nonFunctionalRequirements: [
          "Sub-100ms response time for storefront search",
          "99.9% uptime with PostgreSQL connection pooling",
          "PCI-DSS compliance via Stripe Elements"
        ],
        modules: ["Authentication", "Storefront", "Catalog", "Cart", "Checkout & Payments", "Analytics", "Admin"],
        techStack: ["Next.js 14", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL", "Prisma", "Stripe API"],
        database: ["PostgreSQL", "Prisma ORM"],
        apis: ["REST APIs", "Stripe Webhooks", "Auth JWT"],
        auth: ["Supabase Auth / JWT", "Role-Based Access Control (RBAC)"],
        security: ["HTTPS", "Stripe Signature Verification", "CSRF Protection"],
        uiUx: ["Glassmorphism dashboard", "Mobile responsive checkout", "Dark/Light mode"],
        integrations: ["Stripe", "Resend Email", "Cloudinary"],
        constraints: ["Must deploy on Vercel/Supabase"],
        items: [
          { id: "req-1", category: "auth", title: "RBAC Authentication", description: "Multi-tenant auth for merchants and customers", importance: "high" },
          { id: "req-2", category: "database", title: "Prisma PostgreSQL Schema", description: "Models for Tenants, Users, Products, Orders, OrderItems", importance: "high" },
          { id: "req-3", category: "api", title: "Stripe Webhook Handler", description: "Process payment_intent.succeeded and charge.disputed", importance: "high" }
        ]
      },
      phases: [
        {
          id: "phase-1",
          phaseNumber: 1,
          title: "Project Foundation & Database Schema",
          objective: "Establish PostgreSQL data models using Prisma ORM with multi-tenant isolation.",
          description: "Define Core tables: Tenants, Users, Profiles, Products, Categories, Orders, OrderItems, Payments.",
          requirementsCovered: ["Database Architecture", "Multi-tenant Schema"],
          dependencies: [],
          prerequisites: ["PostgreSQL database instance"],
          expectedOutput: "Valid Prisma schema file `prisma/schema.prisma` and baseline migration script.",
          filesAffected: {
            create: ["prisma/schema.prisma", "src/lib/db.ts"],
            modify: ["package.json"],
            doNotBreak: []
          },
          technologies: ["PostgreSQL", "Prisma", "TypeScript"],
          complexity: "Intermediate",
          completionCriteria: ["Prisma schema compiles without errors", "Migrations run cleanly"],
          prompt: `ROLE\nYou are a Principal Database Architect specializing in multi-tenant PostgreSQL systems.\n\nPROJECT CONTEXT\nProject Name: E-Commerce Micro-SaaS Platform\nSelected DB: PostgreSQL\nAuth: JWT\n\nOBJECTIVE\nCreate a production-grade multi-tenant Prisma schema supporting Users, Tenants, Products, ProductVariants, Carts, Orders, and OrderItems.`,
          versions: [{ version: 1, promptText: "Create Prisma schema for multi-tenant e-commerce.", createdAt: new Date(Date.now() - 86400000 * 3).toISOString() }],
          currentVersion: 1,
          status: "Completed",
          generationStatus: "completed",
          updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
          id: "phase-2",
          phaseNumber: 2,
          title: "Authentication & Role-Based Access Control",
          objective: "Implement JWT auth with role-based access control and tenant isolation middleware.",
          description: "Build sign up, sign in, session verification, and tenant routing middleware.",
          requirementsCovered: ["RBAC Authentication", "Tenant Isolation"],
          dependencies: [1],
          prerequisites: ["Phase 1 Database Schema"],
          expectedOutput: "Auth endpoints, JWT validation middleware, and React hooks.",
          filesAffected: {
            create: ["src/lib/auth.ts", "src/middleware.ts", "src/hooks/use-auth.ts"],
            modify: ["src/lib/db.ts"],
            doNotBreak: ["prisma/schema.prisma"]
          },
          technologies: ["Next.js Middleware", "JWT", "Bcrypt", "TypeScript"],
          complexity: "Advanced",
          completionCriteria: ["Unauthenticated requests redirect to /login", "Tenant isolation enforced in API calls"],
          prompt: `ROLE\nYou are a Senior Security Engineer.\n\nOBJECTIVE\nUsing the database models established in Phase 1, build JWT authentication middleware.`,
          versions: [{ version: 1, promptText: "Implement JWT auth middleware.", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() }],
          currentVersion: 1,
          status: "Completed",
          generationStatus: "completed",
          updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
          id: "phase-3",
          phaseNumber: 3,
          title: "Product Catalog & Variant Management",
          objective: "Create CRUD endpoints and frontend UI for merchants to manage products.",
          description: "Build product upload, image hosting integration, pricing variants, and stock tracking.",
          requirementsCovered: ["Product catalog", "Variant management"],
          dependencies: [1, 2],
          prerequisites: ["Phase 1 DB", "Phase 2 Auth"],
          expectedOutput: "Product API routes and Product Management UI component.",
          filesAffected: {
            create: ["src/routes/api/products.ts", "src/components/products/product-form.tsx"],
            modify: [],
            doNotBreak: ["src/lib/auth.ts", "prisma/schema.prisma"]
          },
          technologies: ["React", "TanStack Query", "Prisma"],
          complexity: "Intermediate",
          completionCriteria: ["Merchants can add products with price & variants"],
          prompt: `ROLE\nYou are a Senior Full-Stack Engineer.\n\nOBJECTIVE\nUsing the auth system built in Phase 2, create tenant-isolated product catalog APIs.`,
          versions: [{ version: 1, promptText: "Build Product API and UI.", createdAt: new Date(Date.now() - 86400000 * 1).toISOString() }],
          currentVersion: 1,
          status: "Not Started",
          generationStatus: "completed",
          updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
        },
        {
          id: "phase-4",
          phaseNumber: 4,
          title: "Shopping Cart & Stripe Checkout Pipeline",
          objective: "Build checkout session management and Stripe payment webhooks.",
          description: "Implement cart persistence, Stripe Checkout session creation, and webhook handler.",
          requirementsCovered: ["Stripe Checkout", "Cart session"],
          dependencies: [2, 3],
          prerequisites: ["Phase 3 Product Catalog"],
          expectedOutput: "Stripe webhook endpoint and cart hooks.",
          filesAffected: {
            create: ["src/routes/api/stripe/webhook.ts", "src/components/cart/cart-drawer.tsx"],
            modify: [],
            doNotBreak: []
          },
          technologies: ["Stripe SDK", "Next.js API Routes"],
          complexity: "Advanced",
          completionCriteria: ["Stripe webhook processes payment_intent.succeeded"],
          prompt: `ROLE\nYou are a Payments Architect.\n\nOBJECTIVE\nUsing the product catalog from Phase 3, build Stripe webhook payment processing.`,
          versions: [{ version: 1, promptText: "Build Stripe webhook handler.", createdAt: new Date(Date.now() - 86400000 * 1).toISOString() }],
          currentVersion: 1,
          status: "Not Started",
          generationStatus: "completed",
          updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
        },
        {
          id: "phase-5",
          phaseNumber: 5,
          title: "Admin Analytics & Deployment Orchestration",
          objective: "Build merchant analytics dashboard and deploy to Vercel.",
          description: "Finalize revenue reporting metrics and setup CI/CD deployment configuration.",
          requirementsCovered: ["Admin analytics", "Deployment"],
          dependencies: [4],
          prerequisites: ["Phase 4 Checkout"],
          expectedOutput: "Analytics dashboard and Vercel build script.",
          filesAffected: {
            create: ["src/routes/admin/analytics.tsx", "vercel.json"],
            modify: [],
            doNotBreak: []
          },
          technologies: ["Recharts", "Vercel"],
          complexity: "Intermediate",
          completionCriteria: ["App deploys to Vercel cleanly"],
          prompt: `ROLE\nYou are a DevOps Engineer.\n\nOBJECTIVE\nDeploy the multi-tenant platform to Vercel and verify production health checks.`,
          versions: [{ version: 1, promptText: "Deploy to Vercel.", createdAt: new Date(Date.now() - 86400000 * 1).toISOString() }],
          currentVersion: 1,
          status: "Not Started",
          generationStatus: "completed",
          updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
        }
      ]
    }
  ];
}

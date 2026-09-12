export type ResourceType =
  | "template"
  | "playbook"
  | "framework"
  | "prompt-pack"
  | "checklist"
  | "curated-list"
  | "mini-tool";

export type ResourceTopic =
  | "all"
  | "ai"
  | "product"
  | "vibe-coding"
  | "content"
  | "business"
  | "productivity"
  | "career";

export type AccessLevel = "open" | "direct-access" | "member-unlock";

export interface ResourcePreviewChecklistItem {
  id: string;
  category?: string;
  title: string;
  description: string;
}

export interface ResourcePreviewPromptItem {
  id: string;
  title: string;
  targetRoleOrTask: string;
  promptText: string;
  variables?: string[];
}

export interface ResourcePreviewFrameworkStep {
  step: string;
  name: string;
  description: string;
  deliverable: string;
}

export interface ResourcePreviewContent {
  type: "checklist" | "prompt-pack" | "framework-steps" | "markdown";
  summaryTitle?: string;
  checklistItems?: ResourcePreviewChecklistItem[];
  promptItems?: ResourcePreviewPromptItem[];
  frameworkSteps?: ResourcePreviewFrameworkStep[];
  markdownContent?: string;
}

export interface ResourceItem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  type: ResourceType;
  topic: ResourceTopic;
  accessLevel: AccessLevel;
  readTimeOrEffort: string;
  featured?: boolean;
  badge?: string; // e.g. "Signature System", "Most Popular", "Essential", "New"
  accentGlow?: string; // CSS color string e.g. "rgba(99,102,241,0.25)"
  thumbnailType?: string;
  whatYouGet: string[];
  bestFor: string[];
  howKhadafiUsesThis: string;
  stats?: {
    usersOrDownloads?: string;
    version?: string;
    lastUpdated?: string;
  };
  actionLabel: string;
  actionUrl?: string; // external Notion, GitHub, or file URL
  previewContent?: ResourcePreviewContent;
  relatedResourcesSlugs?: string[];
  relatedBlogSlugs?: string[];
  updatedAt: string;
}

export interface SignatureSystemPillar {
  id: string;
  num: string;
  name: string;
  tagline: string;
  flow: string[]; // e.g. ["Idea", "Research", "Create", "Publish", "Repurpose"]
  description: string;
  keyOutputs: string[];
  primaryResourceSlug: string;
  accent: string;
}

export interface IntentPath {
  id: string;
  label: string;
  topic: ResourceTopic;
  description: string;
  iconName: string;
  highlightResourceSlug: string;
}

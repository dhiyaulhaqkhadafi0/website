<div align="center">

# Khadafi — Digital Product Ecosystem

**An independent product engineering workspace**  
Designing, building, and shipping useful digital experiences with AI-assisted development.

[Live website](https://khadafidaffa.com) · [About the builder](https://khadafidaffa.com/about) · [Freelance hub](https://khadafidaffa.com/freelance) · [Chikki](https://chikki.id)

</div>

---

## Overview

This repository contains the public codebase for **Khadafi's personal website and digital product platform**. It brings together editorial content, freelance resources, original digital products, and account-based commerce in one Next.js application.

Rather than a static portfolio, this is a living product: new capabilities are researched, designed, implemented, and iterated on as real users interact with them.

## What I'm building

| Area | Purpose |
| --- | --- |
| **Digital products** | Product discovery, detail pages, checkout, orders, and customer library |
| **Freelance Journey Hub** | Guides, resources, curated opportunities, and learning tools |
| **Editorial & Studio** | Articles, publishing workflows, and an owner-facing content studio |
| **User experience** | Responsive UI, accessible navigation, reusable components, and thoughtful motion |
| **Product experiments** | Small tools, prototypes, and practical AI-assisted workflows |

## Engineering stack

- **Frontend:** TypeScript, React, Next.js App Router
- **Backend & data:** Next.js server routes, Supabase Auth, PostgreSQL, Row Level Security
- **Hosting:** Cloudflare Workers with OpenNext
- **Interface:** CSS Modules, Tailwind tooling, Lucide icons, Framer Motion
- **Workflow:** Git-based development, focused release branches, automated checks and reproducible scripts

> This is an evolving independent product. The public default branch is not necessarily the same revision as a live release branch; verify the target branch and release notes before assuming production parity.

## Repository map

```text
src/
  app/           Routes, layouts, server components, APIs
  components/    Feature and shared UI components
  lib/           Server integrations, data access, validation
  content/       Editorial and catalog source content
supabase/        Database migrations
scripts/         Verification and development utilities
docs/            Design, release, and implementation notes
public/          Public static assets
```

## Getting started

**Requirements:** recent Node.js LTS, npm, and your *own* Supabase development project. Do not point a local checkout at production data.

```bash
git clone https://github.com/dhiyaulhaqkhadafi0/website.git
cd website
npm ci
cp .env.example .env.local
npm run dev
```

Update `.env.local` with development-only values as needed. Never commit credentials, customer data, provider checkout links, or downloaded production artifacts.

### Useful checks

```bash
npm run lint
npm run build:next
```

For Cloudflare-specific builds and payment workflows, see the relevant files in `docs/` and run those checks **only in an appropriately isolated environment**. Production payment validation requires a controlled live test; passing local tests alone is not proof of a successful real transaction.

## Security and payments

- Authentication and access control should be enforced on the server and in database policies, not inferred from client-side UI.
- Payment fulfillment must depend on verified provider state and exact order/amount checks; a browser redirect is not proof of payment.
- Secrets belong in platform secret stores and local ignored files, never in Git history.
- See [SECURITY.md](SECURITY.md) for responsible disclosure and precautions.

## About the builder

I'm **Daffa Dhiyaulhaq Khadafi**, an Indonesia-based **AI-Assisted Product Engineer / Digital Builder**. I combine product thinking, UX, full-stack implementation, and AI-assisted workflows to turn concepts into usable software.

This repository is one part of that journey. The separate **Chikki — Immersive Writing Network** is another actively developed product; its private application code is intentionally not exposed here.

**Explore:** [khadafidaffa.com](https://khadafidaffa.com) · [Chikki](https://chikki.id)

---

<sub>Built in public where appropriate. Private customer data, merchant credentials, and internal operations remain private.</sub>

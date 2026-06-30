# Animal Garage Style Guide

Comprehensive reference for developers and AI agents working on **animalgarage.net**. Read this before making changes if you are new to the project.

## Quick start

Common tasks you can do in minutes:

| Task                       | Guide                                                                      |
| -------------------------- | -------------------------------------------------------------------------- |
| Change hero text           | [Quick start → Change hero text](./quick-start.md#change-hero-text)        |
| Add a product to mock data | [Quick start → Add a product](./quick-start.md#add-a-product-to-mock-data) |
| Update footer links        | [Quick start → Update footer links](./quick-start.md#update-footer-links)  |
| Add a new page             | [How to add a page](./frontend/how-to-add-page.md)                         |
| Add a new component        | [How to add a component](./frontend/how-to-add-component.md)               |
| Change styling             | [How to change styling](./frontend/how-to-change-styling.md)               |

## Frontend

Visual design, components, Svelte patterns, and UI conventions.

| Section                                                      | Description                                 |
| ------------------------------------------------------------ | ------------------------------------------- |
| [Design tokens](./frontend/design-tokens.md)                 | Colors, typography, spacing in Tailwind/CSS |
| [Components](./frontend/components.md)                       | Naming, file location, props patterns       |
| [Svelte 5 patterns](./frontend/svelte-patterns.md)           | Runes vs legacy patterns used here          |
| [Animations](./frontend/animations.md)                       | Reveals, transitions, motion guidelines     |
| [Responsive design](./frontend/responsive.md)                | Breakpoints, mobile-first rules             |
| [Media handling](./frontend/media.md)                        | Placeholder vs CDN image patterns           |
| [Accessibility](./frontend/accessibility.md)                 | A11y expectations and checklist             |
| [How to add a page](./frontend/how-to-add-page.md)           | Step-by-step route creation                 |
| [How to add a component](./frontend/how-to-add-component.md) | Step-by-step component creation             |
| [How to change styling](./frontend/how-to-change-styling.md) | Tailwind/CSS examples with real files       |

## Business logic

Data flow, types, i18n, and server/client boundaries.

| Section                                                          | Description                               |
| ---------------------------------------------------------------- | ----------------------------------------- |
| [Data flow](./business-logic/data-flow.md)                       | Mock data → Saleor migration path         |
| [Types & data](./business-logic/types-and-data.md)               | Product/collection types and mock files   |
| [Locale & i18n](./business-logic/i18n.md)                        | Locale/currency patterns                  |
| [Server vs client](./business-logic/server-client-boundaries.md) | SvelteKit code boundaries                 |
| [Environment config](./business-logic/env-config.md)             | `env.ts`, `.env.example`, missing vars    |
| [Mock → Saleor swap](./business-logic/mock-to-saleor.md)         | How loaders work and how to wire real API |

## Backend & ops

Infrastructure, clients, workflow, and deployment.

| Section                                             | Description                                                             |
| --------------------------------------------------- | ----------------------------------------------------------------------- |
| [Supabase](./backend-ops/supabase.md)               | Client setup and planned usage                                          |
| [Saleor client](./backend-ops/saleor-client.md)     | GraphQL client structure                                                |
| [CDN & media](./backend-ops/cdn-media.md)           | S3/CloudFront env vars and URL patterns                                 |
| [Branch workflow](./backend-ops/branch-workflow.md) | feature → dev → main                                                    |
| [Local dev](./backend-ops/local-dev.md)             | Setup, build, lint commands                                             |
| [Deployment](./backend-ops/deployment.md)           | Build adapter + CI summary → [runbook](../infrastructure/deployment.md) |

## Related docs

- [Project roadmap](../README.md)
- [Infrastructure plan](../infrastructure/overview.md)
- [Saleor integration](../commerce/saleor.md)
- [Animation & media strategy](../archive/animation-media.md)
- [Site audit](../audits/site-audit.md)
- [Contributing](../../CONTRIBUTING.md)
- [Agent context](../../agents/AGENTS.md)

# Project Scaling Review & Architectural Proposal

**Date:** 2025-04-12

**Goal:** Review the current backend (`apps/api`) and shared domain (`packages/domain`) structure, propose a scalable architecture for a modular SaaS platform (initially targeting photography agencies), and suggest improvements to `packages/domain` organization, while maintaining a pragmatic approach for a solo developer.

## 1. Current State Analysis

Based on the existing documentation (`docs/backend-architecture.md`, `docs/backend.md`, `docs/clean_architecture.md`, `docs/checkpoint.md`) and file structure:

### 1.1. `apps/api` (Backend)

*   **Strengths:**
    *   Solid foundation using NestJS and a layered architecture (Controller -> Use Case -> Service -> Repository).
    *   Clear separation of concerns demonstrated in existing modules (Auth, Organizations, Memberships, Invites).
    *   Modern tooling (Prisma ORM, Zod validation).
    *   Event-driven patterns used for decoupling (e.g., invite emails via `@nestjs/event-emitter`).
    *   Good initial documentation outlining flows and rationale.
*   **Areas for Consideration:**
    *   Potential for clutter in top-level layer folders (`controllers/`, `use-cases/`, `services/`, `repositories/`) as more domains are added.
    *   Maintaining the clear distinction between Services (domain logic) and Use Cases (application logic/orchestration) requires discipline as complexity grows.

### 1.2. `packages/domain` (Shared Types/Schemas)

*   **Strengths:**
    *   Centralizes shared code (`entities`, `enums`, `events`, `schemas`) enabling reuse (e.g., potential frontend integration).
    *   Uses Zod for robust schema definition and validation.
*   **Areas for Consideration:**
    *   The current `schemas/` organization is becoming complex and lacks clear distinction between different schema types (API DTOs vs. core domain validation).
    *   Flat lists within `entities/`, `enums/`, `events/` could become difficult to manage as the number of domains increases.

## 2. Implemented Scaled Structure (`apps/api`) - Modular Monolith

The backend has been refactored towards a modular monolith structure to enhance scalability and maintainability.

**Implemented Structure:** Related components (controllers, use cases, services, repositories, listeners) are grouped under domain-specific feature modules, while core infrastructure resides in a separate `core` directory. API DTOs are currently imported from `packages/domain`.

```
apps/api/src/
├── core/                  # Core infrastructure, shared modules
│   ├── auth/              # Auth module (controllers, use-cases, services, strategies, guards, events, repositories...)
│   ├── database/          # Prisma service, BaseRepository
│   ├── email/             # Email service integration
│   ├── shared/            # Shared utilities/exceptions across all modules
│   └── core.module.ts     # Imports/exports core functionalities
├── modules/               # Feature/Domain Modules
│   ├── organization/      # Groups Organization, Membership, and Invite logic
│   │   ├── controllers/   # organization.controller, membership.controller, membership-invite.controller
│   │   ├── use-cases/     # create-organization, update-membership, accept-invite, etc.
│   │   ├── services/      # organization.service, membership.service, membership-invite.service
│   │   ├── repositories/  # organization.repository, membership.repository, membership-invite.repository
│   │   ├── events/        # Domain events & listeners specific to this module group
│   │   │   └── listeners/
│   │   └── organization.module.ts # Wires up this domain group
│   ├── billing/             # Future core SaaS module (Placeholder)
│   ├── notifications/       # Future core SaaS module (Placeholder)
│   ├── photography/         # Future specialized Module Example (Placeholder)
│   └── ...                  # Other future modules
├── app.module.ts          # Imports CoreModule and all feature Modules from modules/*
└── main.ts
```

**Mermaid Diagram:**

```mermaid
graph TD
    subgraph ClientApp [Client Application]
        direction LR
        WebApp[Web App]
        MobileApp[Mobile App (Future)]
    end

    subgraph BackendAPI [apps/api - Implemented Modular Monolith]
        direction TB
        AppModule(app.module.ts) --> CoreModule(core/core.module.ts)
        AppModule --> FeatureModules(modules/*)

        subgraph Core [core/]
            direction LR
            AuthMod[auth/]
            DbMod[database/]
            EmailMod[email/]
            SharedMod[shared/]
        end

        subgraph Modules [modules/]
            direction TB
            OrgMod[organization/ (incl. Memberships, Invites)]
            BillMod[billing/ (Future)]
            PhotoMod[photography/ (Future)]
            OtherMods[...]
        end

        CoreModule --> AuthMod & DbMod & EmailMod & SharedMod
        FeatureModules --> OrgMod & BillMod & PhotoMod & OtherMods

        OrgMod --> DbMod & SharedMod & CoreModule & AuthMod # Dependencies for Org/Membership/Invite logic
        BillMod --> DbMod & SharedMod & CoreModule & OrgMod # Example future dependencies
        PhotoMod --> DbMod & SharedMod & CoreModule & OrgMod # Example future dependencies

        AuthMod --> DbMod & SharedMod & EmailMod

    end

    subgraph SharedDomain [packages/domain - Current Structure]
        direction TB
        subgraph DomainFolders [Domain Folders]
          AuthDom[auth/ (enums, dtos)]
          OrgDom[organization/ (dtos)]
          LogDom[logging/ (enums)]
          SharedDom[shared/ (enums, utils)]
        end
        Entities[entities/ (*.schema.ts)]

        DomainFolders --> Entities # DTOs often relate to Entities
    end

    subgraph ExternalServices [External Services]
        direction TB
        EmailProvider[Email Provider]
        PaymentGateway[Payment Gateway (Future)]
    end

    ClientApp --> BackendAPI
    BackendAPI --> SharedDomain
    BackendAPI --> DbMod -- Uses --> Database[(Database - Prisma)]
    BackendAPI --> EmailMod -- Uses --> EmailProvider
    BackendAPI --> PaymentGateway # via Future Billing Module

    style BackendAPI fill:#f9f,stroke:#333,stroke-width:2px
    style SharedDomain fill:#ccf,stroke:#333,stroke-width:2px
    style Core fill:#eef,stroke:#999,stroke-width:1px
    style Modules fill:#efe,stroke:#999,stroke-width:1px
```

*   **Rationale:** Promotes high cohesion (feature components live together), clear boundaries, and easier navigation within the monolith. Grouping related domains (Org, Membership, Invite) initially is pragmatic. DTOs are currently managed in `packages/domain`. Configuration is likely handled via `@nestjs/config` imported where needed.

## 3. Implemented `packages/domain` Structure

The current structure organizes shared code by domain, differing from the original proposal which suggested organization by type (schemas, entities, enums).

```
packages/domain/src/
├── auth/                  # Auth-related shared code
│   ├── dtos/              # Zod schemas for Auth API DTOs (*.dto.ts)
│   │   ├── index.ts
│   │   ├── sign-in-user.dto.ts
│   │   └── ...
│   ├── index.ts
│   ├── provider-types.enum.schema.ts # Enum schema
│   ├── role.enum.schema.ts           # Enum schema
│   └── ...                           # Other enums
├── entities/              # Zod schemas defining data structures (*.schema.ts)
│   ├── index.ts
│   ├── account.schema.ts
│   ├── membership.schema.ts
│   ├── organization.schema.ts
│   ├── user.schema.ts
│   └── ...
├── logging/               # Logging related code
│   ├── index.ts
│   └── error-codes.enum.ts # Enum
├── organization/          # Organization/Membership/Invite related shared code
│   ├── dtos/              # Zod schemas for Org/Memb/Invite API DTOs (*.dto.ts)
│   │   ├── index.ts
│   │   ├── create-organization.dto.ts
│   │   ├── update-membership.dto.ts
│   │   └── ...
│   └── index.ts
├── shared/                # General shared utilities/types
│   ├── index.ts
│   ├── request-params.ts
│   ├── request-query.ts
│   └── time-in-milliseconds.enum.ts # Enum
└── index.ts               # Main package export
```

*   **Structure:** Code is grouped primarily by domain (`auth/`, `organization/`, `logging/`).
*   **DTOs:** API Data Transfer Object Zod schemas (`*.dto.ts`) are located within `dtos/` subfolders inside their respective domain folders.
*   **Entities:** Data structure definitions are Zod schemas (`*.schema.ts`) located in the top-level `entities/` folder. This differs from the proposal which suggested plain types/interfaces here and Zod schemas in a separate `schemas/` directory.
*   **Enums:** Enumerations are currently located within the domain folders they relate to (e.g., `auth/`, `logging/`, `shared/`).
*   **Events:** No dedicated shared `events/` folder exists currently. Event definitions might be local to `apps/api` modules or implicitly defined.

## 4. Potential Future Domains

Consider these domains as the SaaS platform evolves:

*   **Core SaaS:**
    *   Billing & Subscriptions (Stripe/LemonSqueezy integration)
    *   User Settings/Profile Management
    *   Notifications (In-app, Email, Push)
    *   Audit Logs
    *   Feature Flags
    *   API Keys (for potential third-party integrations)
    *   Basic Analytics/Reporting Dashboard
*   **Photography Specific Module:**
    *   Project Management (tracking photo shoots/jobs)
    *   Client Management (CRM features)
    *   Bookings/Scheduling/Availability Calendar
    *   Galleries/Proofing/Client Feedback
    *   Digital Asset Management (Storage integration - S3 etc.)
    *   Invoicing (potentially linked to Billing module)
    *   Contracts/e-Signatures

## 5. Pragmatic Approach for Solo Developer

*   **Iterate:** Implement changes incrementally. Start with the `packages/domain` schema cleanup. Refactor `apps/api` towards the modular structure one domain at a time as you add features or refactor existing ones.
*   **Modular Monolith:** Stick with the monolith (`apps/api`) using the proposed structure. Avoid premature microservice extraction.
*   **Focus:** Prioritize core SaaS features (e.g., Auth, Orgs, Billing) and the essential features of the initial specialized module (Photography). Deliver value early.
*   **Standardize:** Continue enforcing architectural patterns (Use Cases, Repositories, Zod for DTOs, Events) consistently across all modules. Choose an entity approach (simple types/interfaces or richer classes) and apply it consistently where appropriate.
*   **Test:** Maintain unit and integration tests. They are crucial for confidence and catching regressions when working alone.

This approach balances the need for a scalable architecture with the practical constraints of solo development, allowing the structure to evolve alongside the application's features.
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

## 2. Proposed Scaled Structure (`apps/api`) - Modular Monolith

To enhance scalability and maintainability within the monolith (pragmatic for solo dev), adopting a more explicit modular structure is recommended.

**Structure:** Group all related components (controllers, use cases, services, repositories, listeners, module-specific DTOs) under a top-level domain module folder.

```
apps/api/src/
├── core/                  # Core infrastructure, shared modules (Auth, Database, Config, etc.)
│   ├── auth/              # Auth module (controllers, use-cases, services, strategies, guards...)
│   ├── database/          # Prisma service, BaseRepository
│   ├── config/            # Configuration module
│   ├── shared/            # Truly shared utilities/exceptions across all modules
│   └── core.module.ts     # Imports/exports core functionalities
├── modules/               # Feature/Domain Modules
│   ├── organizations/
│   │   ├── controllers/
│   │   │   └── organizations.controller.ts
│   │   ├── use-cases/
│   │   │   └── create-organization.use-case.ts
│   │   │   └── ...
│   │   ├── services/
│   │   │   └── organization.service.ts
│   │   ├── repositories/
│   │   │   └── organization.repository.ts # Implementation
│   │   ├── listeners/
│   │   │   └── organization-event.listener.ts
│   │   ├── dtos/            # Zod schemas specific to this module's API (can import base types from packages/domain)
│   │   │   └── create-organization.dto.ts
│   │   └── organizations.module.ts # Wires up this specific domain
│   ├── memberships/         # Similar structure...
│   ├── membership-invites/  # Similar structure...
│   ├── billing/             # Future core SaaS module
│   ├── notifications/       # Future core SaaS module
│   ├── photography/         # Specialized Module Example
│   │   ├── controllers/     # e.g., BookingsController, ProjectsController
│   │   ├── use-cases/       # e.g., CreateBookingUseCase
│   │   ├── services/        # e.g., PricingService, AvailabilityService
│   │   ├── repositories/    # e.g., BookingRepository
│   │   ├── listeners/
│   │   ├── dtos/
│   │   └── photography.module.ts
│   └── ...                  # Other future modules (e.g., clients, projects)
├── app.module.ts          # Imports CoreModule and all feature Modules from modules/*
└── main.ts
```

**Mermaid Diagram:**

```mermaid
graph TD
    subgraph ClientApp [Client Application]
        direction LR
        WebApp[Web App]
        MobileApp[Mobile App]
    end

    subgraph BackendAPI [apps/api - Modular Monolith]
        direction TB
        AppModule(app.module.ts) --> CoreModule(core/core.module.ts)
        AppModule --> FeatureModules(modules/*)

        subgraph Core [core/]
            direction LR
            AuthMod[auth/]
            DbMod[database/]
            ConfigMod[config/]
            SharedMod[shared/]
        end

        subgraph Modules [modules/]
            direction TB
            OrgMod[organizations/]
            MembMod[memberships/]
            InvMod[membership-invites/]
            BillMod[billing/]
            PhotoMod[photography/]
            OtherMods[...]
        end

        CoreModule --> AuthMod & DbMod & ConfigMod & SharedMod
        FeatureModules --> OrgMod & MembMod & InvMod & BillMod & PhotoMod & OtherMods

        OrgMod --> DbMod & SharedMod & CoreModule
        MembMod --> DbMod & SharedMod & CoreModule
        InvMod --> DbMod & SharedMod & CoreModule & OrgMod & MembMod
        BillMod --> DbMod & SharedMod & CoreModule & OrgMod
        PhotoMod --> DbMod & SharedMod & CoreModule & OrgMod # Example dependencies

        AuthMod --> DbMod & SharedMod

    end

    subgraph SharedDomain [packages/domain]
        direction LR
        Entities[entities/]
        Enums[enums/]
        Events[events/]
        Schemas[schemas/]
    end

    subgraph ExternalServices [External Services]
        direction TB
        EmailService[Email Service]
        PaymentGateway[Payment Gateway]
    end

    ClientApp --> BackendAPI
    BackendAPI --> SharedDomain
    BackendAPI --> DbMod -- Uses --> Database[(Database - Prisma)]
    BackendAPI --> EmailService
    BackendAPI --> PaymentGateway # via Billing Module

    style BackendAPI fill:#f9f,stroke:#333,stroke-width:2px
    style SharedDomain fill:#ccf,stroke:#333,stroke-width:2px
    style Core fill:#eef,stroke:#999,stroke-width:1px
    style Modules fill:#efe,stroke:#999,stroke-width:1px
```

*   **Rationale:** Promotes high cohesion (feature components live together), clear boundaries, easier navigation, and better prepares for potential future extraction if needed, while remaining a single deployable unit initially.

## 3. Proposed `packages/domain` Structure

Improve clarity and organization, especially for schemas.

```
packages/domain/src/
├── entities/              # Core domain entities (Plain classes, interfaces, or Zod inferred types)
│   ├── index.ts
│   ├── organization.entity.ts # Example definition
│   ├── user.entity.ts
│   └── photography/         # Optional: Group by domain if list grows large
│       └── booking.entity.ts
├── enums/                 # Shared enums
│   ├── index.ts
│   ├── role.enum.ts
│   └── photography/
│       └── booking-status.enum.ts
├── events/                # Shared event payload definitions (interfaces/types)
│   ├── index.ts
│   ├── membership-invite-created.event.ts
│   └── photography/
│       └── booking-confirmed.event.ts
├── schemas/               # Zod schemas
│   ├── index.ts
│   ├── core/                # Schemas for fundamental types (ID, pagination, etc.)
│   │   ├── id.schema.ts
│   │   └── pagination.schema.ts
│   ├── api/                 # Schemas defining API request/response DTOs
│   │   ├── index.ts
│   │   ├── auth/            # DTOs for Auth endpoints
│   │   │   ├── sign-in.dto.schema.ts
│   │   │   └── token-response.dto.schema.ts
│   │   ├── organizations/   # DTOs for Org endpoints
│   │   │   ├── create-organization.dto.schema.ts
│   │   │   └── organization.dto.schema.ts # Response DTO
│   │   ├── photography/     # DTOs for Photography endpoints
│   │   │   ├── create-booking.dto.schema.ts
│   │   │   └── booking.dto.schema.ts
│   │   └── common/          # Common API response wrappers (if any)
│   │       └── api-response.schema.ts
│   └── domain/              # Optional: Zod schemas for validating core domain entity rules or complex value objects
│       ├── index.ts
│       └── organization/
│           └── organization-name.schema.ts # e.g., specific validation for just the name
└── index.ts               # Main package export
```

*   **Key Change:** Explicitly separate API DTO schemas (`schemas/api/`) from potential core domain validation schemas (`schemas/domain/`). This clarifies intent – most validation happens at the API boundary using DTO schemas.
*   **Grouping:** Introduce domain-specific subfolders within `entities/`, `enums/`, `events/`, and `schemas/api/` as the project grows.
*   **Flexibility:** The `entities/` directory can contain plain TypeScript classes, interfaces, or types inferred from Zod schemas, depending on the complexity required for each domain concept.

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
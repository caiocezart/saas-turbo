# Checkpoint: Architectural Discussions Summary

**Date:** 2025-04-12

**Context:** This document summarizes key architectural discussions regarding the scaling and structuring of the NestJS backend (`apps/api`) and the shared domain package (`packages/domain`) for the SaaS platform project.

## 1. Initial Goal & Review

*   **Objective:** Review the current architecture and propose a scalable structure for a modular SaaS platform, considering future features and specialized modules (e.g., photography).
*   **Current State:** The existing NestJS application uses a layered architecture (Controller -> Use Case -> Service -> Repository) and a shared `packages/domain` for types/schemas. This is a solid foundation but has potential scaling challenges in folder organization and schema clarity within `packages/domain`.

## 2. Proposed Modular Monolith Structure (`project_scaling_review.md`)

*   **Recommendation:** Evolve `apps/api` towards a "Modular Monolith".
*   **Structure:** Group related components (controllers, services/use cases, repositories, DTOs, listeners) into domain-specific feature modules under `apps/api/src/modules/` (e.g., `modules/organizations/`, `modules/billing/`). Core infrastructure (DB connection, config, base auth) would reside in `apps/api/src/core/`.
*   **Benefits:** Improves cohesion, clarifies boundaries, enhances maintainability, and facilitates potential future extraction if needed.
*   **Repository Placement:** Repositories specific to a domain should reside within that feature module's `repositories/` subfolder, promoting encapsulation.
*   **Module Interaction:** Modules interact by importing other modules and injecting their *exported* services or use cases, not by directly accessing repositories across module boundaries.

## 3. Proposed `packages/domain` Refinement (`project_scaling_review.md`)

*   **Recommendation:** Improve clarity and organization.
*   **Structure:**
    *   Keep `entities/`, `enums/`, `events/`. Consider domain subfolders within these as complexity grows.
    *   Clearly separate Zod schemas:
        *   `schemas/api/`: For API Data Transfer Object (DTO) validation (request/response). Group by domain (e.g., `schemas/api/organizations/`).
        *   `schemas/core/`: For fundamental types (ID, pagination).
        *   `schemas/domain/`: Optional, for complex core domain rule validation if needed beyond entity logic or value objects.
*   **Entity Flexibility:** The initial proposal allows `entities/` to contain simple interfaces, types inferred from Zod, or richer classes, depending on domain needs.

## 4. Domain Entity Implementation Deep Dive

*   **Discussion:** Explored using richer domain entities (TypeScript classes following DDD patterns) vs. simpler types/interfaces.
*   **DDD Pattern (`ddd_entity_proposal.md`):**
    *   Detailed an alternative approach using `Entity`, `AggregateRoot`, Value Objects, and Domain Events.
    *   **Benefits:** Strong encapsulation of state and behavior, clearer domain model, improved testability, robust decoupling via Domain Events (dispatched post-transaction).
    *   **Trade-offs:** Increased boilerplate, learning curve, mapping overhead in repositories.
    *   **Comparison (`signup_flow_ddd_comparison.md`):** Analyzed the signup flow step-by-step, comparing the current implementation to the DDD approach. Highlighted how logic moves into entity methods.
*   **Impact on Sharing:** Acknowledged that adopting rich backend entity classes reduces direct frontend reuse of complex entity logic; sharing focuses on DTOs (defined via Zod or generated from OpenAPI).

## 5. Technology Stack Consideration (NestJS vs. .NET Core)

*   **Context:** Explored if switching to .NET Core would be beneficial given the potential shift towards richer backend entities.
*   **Analysis:** Weighed .NET's potential performance and DDD maturity against NestJS's unified TypeScript ecosystem, direct code sharing (enums, utils, DTOs via Zod or OpenAPI generation), Prisma integration, and existing codebase/familiarity.
*   **Recommendation:** Stick with **NestJS**. For a solo developer prioritizing productivity and leveraging the monorepo, the benefits of the unified TypeScript stack outweigh the potential advantages of switching languages at this stage. NestJS fully supports the desired DDD patterns.
*   **API Contract:** Agreed that using OpenAPI (Swagger) to define the API contract and generate frontend clients/DTOs is a robust, language-agnostic approach suitable for either backend choice.

## 6. Next Steps / POC

*   A Proof of Concept (POC) to implement the Organization CRUD flow in .NET Core (using EF Core + PostgreSQL) within the monorepo (`apps/dot-net-api`) was initiated in a separate sub-task to provide a concrete comparison point for developer experience and structure. *(Status: POC sub-task created)*.

This checkpoint summarizes the key decisions and explorations regarding the project's architecture moving forward.
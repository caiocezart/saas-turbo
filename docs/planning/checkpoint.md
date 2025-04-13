# Checkpoint: Architectural Discussions Summary

**Date:** 2025-04-12

**Context:** This document summarizes key architectural discussions regarding the scaling and structuring of the NestJS backend (`apps/api`) and the shared domain package (`packages/domain`) for the SaaS platform project.

## 1. Initial Goal & Review

*   **Objective:** Review the current architecture and propose a scalable structure for a modular SaaS platform, considering future features and specialized modules (e.g., photography).
*   **Current State:** The existing NestJS application uses a layered architecture (Controller -> Use Case -> Service -> Repository) and a shared `packages/domain` for types/schemas. This is a solid foundation but has potential scaling challenges in folder organization and schema clarity within `packages/domain`.

## 2. Implemented Modular Monolith Structure (`apps/api`)

*   **Status:** `apps/api` has been refactored towards a "Modular Monolith".
*   **Implemented Structure:**
    *   Core infrastructure (Auth, Database, Email, Shared utilities) resides in `apps/api/src/core/`.
    *   Feature/domain logic is grouped into modules under `apps/api/src/modules/`. Currently, an `organization/` module exists, grouping logic for Organizations, Memberships, and Invites.
    *   Components (controllers, services, use cases, repositories, events/listeners) are co-located within their respective core or feature module.
    *   API DTOs are currently defined in and imported from `packages/domain`.
*   **Benefits Realized:** Improved cohesion, clearer boundaries between core and feature logic, enhanced maintainability.
*   **Repository Placement:** Repositories are located within their respective module's `repositories/` subfolder (e.g., `core/auth/repositories/`, `modules/organization/repositories/`).
*   **Module Interaction:** Modules interact via NestJS module imports and dependency injection of exported providers (services, use cases).

## 3. Implemented `packages/domain` Structure

*   **Status:** `packages/domain` has been refactored, but differs from the original proposal in `project_scaling_review.md`.
*   **Implemented Structure:**
    *   Code is primarily organized by domain folders at the root (`auth/`, `organization/`, `logging/`, `shared/`).
    *   API DTOs (Zod schemas, `*.dto.ts`) are located in `dtos/` subfolders within their respective domain folders (e.g., `auth/dtos/`, `organization/dtos/`).
    *   A top-level `entities/` folder contains Zod schemas (`*.schema.ts`) defining data structures/models. This differs from the proposal's intent to use this folder for plain types/interfaces.
    *   Enums are located within the domain folders they most closely relate to (e.g., `auth/`, `logging/`, `shared/`).
    *   There is no dedicated top-level `schemas/`, `enums/`, or `events/` folder as originally proposed.
*   **Current Approach:** This structure groups shared code by domain feature rather than by code type (schema, entity, enum). While functional, it offers less explicit separation between API contracts (DTOs) and internal data structures (`entities/*.schema.ts`) compared to the original proposal.

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
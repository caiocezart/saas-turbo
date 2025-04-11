# Checkpoint: CRUD Implementation Progress (Organizations, Memberships, Invites)

**Date:** 2025-04-11
**Updated:** 2025-04-12

**Objective:** Implement standard CRUD operations (Controller, Use Cases, Services) for Organizations, Memberships, and MembershipInvites entities in the NestJS API.

**Completed Work:**

1.  **Organizations:**
    *   **Schemas:** Verified/created Zod schemas for create (`createOrganizationSchema`), update (`updateOrganizationSchema`), and ID parameter (`organizationIdSchema`) in `@repo/domain`. Updated index files.
    *   **Database:** Updated Prisma schema (`schema.prisma`) to align `Organization` model fields (language fields) with domain entity definitions. (Migration was handled manually by the user).
    *   **Service:** Updated `OrganizationService` (`apps/api/src/use-cases/organizations/services/organization.service.ts`) to include `getOrganizationById` and use domain enums (`PrismaRoles`).
    *   **Use Cases:** Reviewed/corrected `CreateOrganizationUseCase`, `GetOrganizationUseCase`, `UpdateOrganizationUseCase`, `DeleteOrganizationUseCase` in `apps/api/src/use-cases/organizations/`. Ensured correct service methods are called and domain types/enums are used.
    *   **Controller:** Implemented `OrganizationsController` (`apps/api/src/http/controllers/organizations.controller.ts`) with endpoints for POST, GET (by ID), PATCH (by ID), DELETE (by ID). Applied `JwtAuthGuard`, `ZodValidationPipe` for body/param validation, and used `RequestPayload` decorator correctly.

2.  **Memberships:**
    *   **Schemas:** Created Zod schemas for ID (`membershipIdSchema`), update (`updateMembershipSchema`), and list query (`listMembershipsSchema`) in `packages/domain/src/schemas/membership/`. Updated index files.
    *   **Service:** Created `MembershipService` (`apps/api/src/use-cases/memberships/services/membership.service.ts`) with methods for `getMembershipById`, `listMemberships`, `updateMembershipRole`, `deleteMembership`, and `getMembershipByUserAndOrg`. Ensured methods return domain `Membership` type (using type assertion). Corrected usage of `findAll` from `BaseRepository`.
    *   **Use Cases:** Created `GetMembershipUseCase`, `ListMembershipsUseCase`, `UpdateMembershipUseCase`, `DeleteMembershipUseCase` in `apps/api/src/use-cases/memberships/`.
    *   **Controller:** Created `MembershipsController` (`apps/api/src/http/controllers/memberships.controller.ts`) with endpoints for GET (list), GET (by ID), PATCH (by ID), DELETE (by ID). Applied `JwtAuthGuard` and `ZodValidationPipe`.

3.  **MembershipInvites:**
    *   **Schemas:** Created Zod schemas for ID (`membershipInviteIdSchema`), token (`membershipInviteTokenSchema`), create (`createMembershipInviteSchema`), and list query (`listMembershipInvitesSchema`) in `packages/domain/src/schemas/membership-invite/`. Updated index files.
    *   **Repository:** Created `MembershipInviteRepository` that extends `BaseRepository` for database access.
    *   **Service:** Created `MembershipInviteService` with methods for `createMembershipInvite`, `getMembershipInviteById`, `getMembershipInviteByToken`, `listMembershipInvites`, `acceptMembershipInvite`, and `deleteMembershipInvite`.
    *   **Use Cases:** Created `CreateMembershipInviteUseCase`, `GetMembershipInviteUseCase`, `GetMembershipInviteByTokenUseCase`, `ListMembershipInvitesUseCase`, `AcceptMembershipInviteUseCase`, and `DeleteMembershipInviteUseCase`.
    *   **Events:** Created event classes `MembershipInviteCreatedEvent` and `MembershipInviteAcceptedEvent`.
    *   **Listener:** Implemented `MembershipInviteListener` to handle sending emails when invites are created and accepted.
    *   **Controller:** Created `MembershipInvitesController` and `MembershipInvitesPublicController` with endpoints for creating, listing, getting, and deleting invites, as well as public endpoints for getting an invite by token and accepting an invite.
    *   **Cleanup:** Removed redundant schema file `packages/domain/src/schemas/organization/create-membership-invite.schema.ts` and its export from the index file.

4.  **Module Integration:**
    *   Updated `HttpModule` to include the new controllers.
    *   Updated `UseCasesModule` to include the new services and use cases.
    *   Updated `DatabaseModule` to include the `MembershipInviteRepository`.
    *   Updated `AppModule` to configure `EventEmitterModule` and include the `MembershipInviteListener`.

**Current Status:**

*   Completed the implementation of CRUD operations for Organizations, Memberships, and MembershipInvites.
*   Implemented event-driven email notifications for invite creation and acceptance.

**Next Steps:**

1.  **Testing:**
    *   Write unit tests for services and use cases.
    *   Write integration tests for the controllers.
    *   Test the event listener and email sending functionality.

2.  **Documentation:**
    *   Update API documentation for the new endpoints.
    *   Create example requests and responses for the API documentation.

3.  **UI Implementation:**
    *   Implement the frontend components for managing organizations, memberships, and invites.
    *   Create forms for creating and accepting invites.
    *   Implement UI for displaying organization members and their roles.

4.  **Refinement:**
    *   Review error handling, edge cases, and potential optimizations.
    *   Implement rate limiting for invite creation to prevent abuse.
    *   Add audit logging for sensitive operations like role changes and membership deletions.

---

## Relevant Files and Architecture

**Core Pattern:** Controller -> Use Case -> Service -> Repository

**Key Locations:**

*   **Domain (`packages/domain/src/`):** Contains shared types, entities, enums, and Zod schemas.
    *   `entities/`: Defines core data structures (e.g., `organization.entity.ts`, `membership.entity.ts`).
    *   `enums/`: Defines shared enumerations (e.g., `role.enum.ts`).
    *   `schemas/`: Contains Zod schemas for validation (organized by feature: `organization`, `membership`, `membership-invite`, `auth`).
    *   `index.ts`: Main export point for the domain package.
*   **API Application (`apps/api/src/`):** The NestJS backend.
    *   `http/controllers/`: Handles incoming HTTP requests, uses guards and pipes (e.g., `organizations.controller.ts`, `memberships.controller.ts`).
    *   `use-cases/`: Contains business logic, organized by feature (e.g., `organizations/`, `memberships/`). Each feature typically has subdirectories for `services/`.
    *   `database/repositories/`: Abstracts database access using Prisma (e.g., `organization.repository.ts`, `membership.repository.ts`). Extends `base.repository.ts`.
    *   `database/prisma/`: Contains `prisma.service.ts` and the `schema.prisma` file.
    *   `http/guards/`: Authentication/Authorization logic (e.g., `jwt-auth.guard.ts`).
    *   `http/pipes/`: Request data transformation/validation (e.g., `zod-validation-pipe.ts`).
    *   `http/decorators/`: Custom decorators (e.g., `request-payload.decorator.ts`).
    *   `*.module.ts`: NestJS modules wiring dependencies (e.g., `app.module.ts`, `http.module.ts`, `use-cases.module.ts`).
    *   `events/`: Event classes for the event-driven architecture.
    *   `listeners/`: Event listeners for handling side effects like sending emails.

**Specific Files Created/Modified in this Implementation:**

*   `apps/api/src/use-cases/membership-invites/services/membership-invite.service.ts`
*   `apps/api/src/use-cases/membership-invites/*.use-case.ts`
*   `apps/api/src/events/membership-invite-created.event.ts`
*   `apps/api/src/events/membership-invite-accepted.event.ts`
*   `apps/api/src/http/controllers/membership-invites.controller.ts`
*   `apps/api/src/database/repositories/membership-invite.repository.ts`
*   `apps/api/src/listeners/membership-invite.listener.ts`
*   `apps/api/src/use-cases/memberships/services/membership.service.ts` (updated)
*   `apps/api/src/http/http.module.ts` (updated)
*   `apps/api/src/use-cases/use-cases.module.ts` (updated)
*   `apps/api/src/database/database.module.ts` (updated)
*   `apps/api/src/app.module.ts` (updated)
*   `packages/domain/src/schemas/organization/index.ts` (updated)
*   `packages/domain/src/schemas/organization/create-membership-invite.schema.ts` (marked for deletion)
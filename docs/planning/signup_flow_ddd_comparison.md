# Signup Flow: Current Implementation vs. DDD Entity Pattern

**Date:** 2025-04-12

**Goal:** Compare the current user signup flow with a potential implementation using the richer Domain-Driven Design (DDD) entity pattern (as detailed in `docs/planning/ddd_entity_proposal.md`). This comparison aims to clarify the differences in structure, responsibilities, data flow, and the benefits/trade-offs involved.

**Files Referenced (Current Implementation):**

*   `apps/api/src/http/controllers/auth.controller.ts`
*   `apps/api/src/use-cases/auth/sign-up.use-case.ts`
*   `apps/api/src/database/repositories/user.repository.ts`
*   `apps/api/src/database/repositories/account.repository.ts`
*   `apps/api/src/database/repositories/verification.repository.ts`
*   `apps/api/src/use-cases/auth/services/crypto.service.ts` (Assumed)
*   `apps/api/src/use-cases/auth/services/verification.service.ts` (Assumed)
*   `apps/api/src/use-cases/auth/services/token.service.ts` (Assumed)

---

## 1. Current Signup Flow Breakdown

The current flow follows a typical layered approach common in frameworks like NestJS:

1.  **Controller (`AuthController`)**:
    *   Receives POST `/auth/sign-up` request.
    *   Uses `ZodValidationPipe` to validate the request body (`SignUpUser` DTO).
    *   Injects `RequestPayload` (containing IP, etc.).
    *   Calls `SignUpUseCase.execute()` with the request payload and validated DTO.
    *   Receives access and refresh tokens from the use case.
    *   Calls `setAuthCookies()` to set HTTP-only cookies on the response.
    *   Sends the response (implicitly 200 OK or similar upon cookie setting).

2.  **Use Case (`SignUpUseCase`)**:
    *   Injects repositories (`User`, `Account`), services (`Crypto`, `Verification`, `Token`), `EventEmitter2`, and `PrismaService`.
    *   Checks if a user with the given email already exists using `UserRepository.findByEmail()`. Throws if exists.
    *   Hashes the password using `CryptoService.hash()`.
    *   **Initiates a Prisma transaction (`prisma.$transaction`)**:
        *   Calls `AccountRepository.createUserAccount()` (passing the transaction client `tx`). This method *internally* creates both the `User` and `Account` records in the database.
        *   Calls `VerificationService.requestVerificationCode()` (passing `tx`). This service likely generates a code, determines expiry, and calls `VerificationRepository.createVerification()` (passing `tx`) which deletes old codes and creates the new one.
        *   Calls `TokenService.signTokens()` (passing `tx`). This service generates JWTs and likely persists the refresh token using `RefreshTokenRepository` (passing `tx`).
        *   Returns the created `account` (with nested `user`), `verificationCode`, `accessToken`, and `refreshToken` from the transaction block.
    *   **After successful transaction commit**:
        *   Constructs a `SignedUpUserEvent` payload containing user details and the verification link/code (obtained via `VerificationService.getVerificationLink()`).
        *   Emits the event using `eventEmitter.emit(EventBusTopics.USER_SIGNED_UP, ...)`.
        *   Returns the access and refresh tokens to the controller.
    *   Includes basic logging.
    *   Wraps the core logic in a try/catch, throwing a generic `INTERNAL_SERVER_ERROR` on failure.

3.  **Repositories (`UserRepository`, `AccountRepository`, `VerificationRepository`)**:
    *   Extend a `BaseRepository`.
    *   Interact directly with `PrismaService` (or a transaction client `tx`).
    *   Methods like `createUserAccount` encapsulate multiple database operations (creating User then Account).
    *   Generally return Prisma-generated types (e.g., `User`, `Account`) or selected fields.
    *   Accept optional transaction clients (`tx`) to participate in transactions orchestrated by the use case.

4.  **Services (`CryptoService`, `VerificationService`, `TokenService`)**:
    *   Handle specific infrastructural or cross-cutting concerns (hashing, code generation/validation, token signing/persistence).
    *   `VerificationService` likely interacts with `VerificationRepository`.
    *   `TokenService` likely interacts with `RefreshTokenRepository`.

5.  **Event Handling**:
    *   Uses `@nestjs/event-emitter`.
    *   Event (`SignedUpUserEvent`) is emitted by the `SignUpUseCase` *after* the database transaction.
    *   Listeners (e.g., for sending welcome/verification emails) subscribe to `EventBusTopics.USER_SIGNED_UP`.

---

## 2. Proposed DDD Signup Flow Breakdown

This flow utilizes rich domain entities, aggregates, domain events, and repositories focused on domain objects.

1.  **Controller (`AuthController`)**:
    *   **(No Change)** Receives request, validates DTO (`SignUpUser`), injects `RequestPayload`.
    *   Calls `SignUpUseCase.execute()` with request payload and validated DTO.
    *   **(No Change)** Receives tokens.
    *   **(No Change)** Sets cookies and sends response.
    *   *Responsibility remains focused on HTTP handling and basic input validation.*

2.  **Use Case (`SignUpUseCase`)**:
    *   Injects *domain-focused* repositories (`UserRepository`, `AccountRepository`), services (`Crypto`, `Verification`, `Token`), and the `DomainEvents` dispatcher (or mechanism to trigger it).
    *   Checks if user exists using `UserRepository.findByEmail()`. Throws if exists.
    *   Hashes password using `CryptoService.hash()` (could potentially be a `Password` Value Object creation).
    *   **Creates Domain Entities**:
        *   Calls `User.create(props)` factory method, passing validated data (email, name). The `User` entity constructor/factory enforces invariants (e.g., valid email format) and *raises* a `UserSignedUp` domain event internally (`this.addDomainEvent(...)`).
        *   Calls `Account.create(props)` factory method, passing the newly created `User`'s ID, provider info, and hashed password.
        *   Calls `Verification.create(props)` factory method (or potentially a method on the `User` entity like `user.requestEmailVerification()`) which creates a `Verification` entity and raises an `EmailVerificationRequested` domain event.
    *   **Persists Aggregates via Repositories**:
        *   Calls `UserRepository.save(user)`.
        *   Calls `AccountRepository.save(account)`.
        *   Calls `VerificationRepository.save(verification)` (or this might be handled within `UserRepository.save(user)` if `Verification` is part of the `User` aggregate).
        *   *Note:* Persistence operations might be wrapped in a transaction managed by the Use Case or a Unit of Work pattern, ensuring all related aggregates are saved together.
    *   **After successful persistence (transaction commit)**:
        *   Triggers the dispatch of collected domain events via `DomainEvents.dispatchEventsForAggregate(user.id)` (and potentially `account.id`).
    *   Calls `TokenService.signTokens()` to generate JWTs (this service might now take the domain `User` object or just the ID). Persisting the refresh token still happens here or via its own repository.
    *   Returns tokens to the controller.
    *   *Responsibility shifts to orchestrating domain object creation and persistence, relying on entities for business rules and event raising.*

3.  **Domain Entities (`User`, `Account`, `Verification` - Classes)**:
    *   **`User` (Aggregate Root)**:
        *   `create()`: Static factory method. Validates input (e.g., email format, name presence). Creates `UniqueEntityID`. Initializes properties. Raises `UserSignedUp` domain event. Returns `User` instance.
        *   `requestEmailVerification()`: Method that potentially creates a `Verification` entity/value object and raises `EmailVerificationRequested` event.
        *   Properties (`id`, `email`, `name`, `emailVerified`, etc.). Getters/Setters might enforce rules.
    *   **`Account` (Aggregate Root or Entity)**:
        *   `create()`: Static factory. Takes `userId`, `providerType`, hashed `Password` (Value Object). Creates `UniqueEntityID`. Initializes properties.
        *   Properties (`id`, `userId`, `providerType`, `passwordHash`, etc.).
    *   **`Verification` (Entity or Value Object)**:
        *   `create()`: Factory. Takes `userId`, `action`, `method`, generated `VerificationCode` (Value Object), `expiresAt`.
        *   Properties (`code`, `expiresAt`, `action`, `method`).
    *   *Responsibility: Encapsulate state, enforce business rules (invariants), and raise domain events upon significant state changes.*

4.  **Value Objects (`Email`, `Password`, `VerificationCode`, `UniqueEntityID`)**:
    *   Represent simple concepts defined by their attributes.
    *   Typically immutable.
    *   Contain validation logic within their constructors or factory methods (e.g., `Email` ensures valid format, `Password` handles hashing/comparison).

5.  **Repositories (`UserRepository`, `AccountRepository`, `VerificationRepository`)**:
    *   Interfaces defined in the domain layer, implementations in infrastructure.
    *   Methods now accept and return *domain entities* (`User`, `Account` classes) or `UniqueEntityID`s.
    *   **Crucially handle mapping**:
        *   `save(user: User)`: Maps the `User` domain entity to the Prisma data structure needed for `prisma.user.create` or `prisma.user.update`.
        *   `findById(id: UniqueEntityID): Promise<User | null>`: Fetches data using `prisma.user.findUnique` and maps the result back to a `User` domain entity instance (e.g., using `User.fromPersistence(prismaData)`).
    *   Implement persistence logic (calling Prisma methods). Might handle transaction propagation if using a Unit of Work pattern.
    *   *Responsibility: Persistence abstraction and mapping between domain objects and database representation.*

6.  **Services (`CryptoService`, `VerificationService`, `TokenService`)**:
    *   `CryptoService`: May be replaced by `Password` Value Object logic, or remain for hashing.
    *   `VerificationService`: Might become simpler, focusing only on code *generation* and link creation, with validation logic potentially moving to the `Verification` entity/VO or the `User` entity.
    *   `TokenService`: Remains largely an infrastructure/application concern for JWT handling.

7.  **Domain Event Handling**:
    *   Uses the `DomainEvents` dispatcher pattern.
    *   Events (`UserSignedUp`, `EmailVerificationRequested`) are raised by domain entities.
    *   Dispatcher is triggered by the Use Case *after* successful persistence.
    *   Listeners (defined in application/infrastructure) subscribe to specific `DomainEvent` classes via `DomainEvents.register()`. They receive the strongly-typed domain event object.
    *   *Responsibility: Decoupling side effects (email sending, etc.) from the core domain logic, triggered by actual domain state changes.*

---

## 3. Step-by-Step Comparison (Signup Flow)

| Step / Component        | Current Implementation                                                                                                | Proposed DDD Implementation                                                                                                                               | Key Differences & Benefits                                                                                                                                                                                                                            |
| :---------------------- | :-------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Controller**       | Receives DTO, validates via Pipe, calls Use Case, sets cookies.                                                       | *(No significant change)* Receives DTO, validates via Pipe, calls Use Case, sets cookies.                                                                 | Controller remains thin, focused on HTTP concerns in both approaches.                                                                                                                                                                                 |
| **2. Use Case: Start**  | Checks email existence (`UserRepository`). Hashes password (`CryptoService`). Starts Prisma transaction.                | Checks email existence (`UserRepository`). Creates `Password` VO (handles hashing). *(Transaction might start here or be handled by Unit of Work later)*. | DDD pushes hashing logic into `Password` VO creation. Transaction management might be handled differently (e.g., Unit of Work pattern).                                                                                                              |
| **3. Use Case: Core Logic** | Calls `AccountRepository.createUserAccount()` (creates User+Account in DB). Calls `VerificationService.request...`. | Calls `User.create()` (returns User instance, raises event). Calls `Account.create()` (returns Account instance). Calls `user.requestEmailVerification()` (raises event). | **Major Shift:** DDD creates domain objects *first*, encapsulating rules & raising events. Current approach calls repo methods that directly manipulate DB state. DDD separates object creation from persistence.                                          |
| **4. Use Case: Persistence** | `AccountRepository.createUserAccount` handles User+Account creation within the transaction. Other repos called with `tx`. | Calls `userRepository.save(user)`, `accountRepository.save(account)`. *(Persistence happens explicitly after domain objects are created)*.             | DDD makes persistence an explicit step orchestrated by the use case *after* domain logic. Current approach mixes creation and persistence within repository methods. DDD offers clearer separation.                                                     |
| **5. Use Case: Events** | Emits application event (`EventEmitter2`) *after* transaction, using data returned from DB/services.                  | Triggers `DomainEvents.dispatchEventsForAggregate()` *after* successful persistence/transaction.                                                          | DDD events are raised *by the domain* during state changes and dispatched centrally post-persistence. Current approach raises events *from the application layer* based on the outcome. DDD provides stronger coupling of events to domain state changes. |
| **6. Use Case: Finish** | Returns tokens generated by `TokenService`.                                                                           | Returns tokens generated by `TokenService`.                                                                                                               | Token generation remains similar, though `TokenService` might receive domain objects/IDs.                                                                                                                                                           |
| **7. Domain Logic**     | Primarily resides in Services (`VerificationService`) and implicitly in Repository methods (`createUserAccount`).       | Resides within Entity methods (`User.create`, `User.requestEmailVerification`) and Value Object constructors/methods (`Password`, `Email`).                 | **Benefit:** DDD centralizes domain rules and behavior within the domain objects themselves, improving cohesion and making the domain model explicit and testable in isolation.                                                                      |
| **8. Repositories**     | Return Prisma types. Methods like `createUserAccount` bundle multiple DB operations. Accept `tx` client.               | Return Domain Entities/VOs. Methods focus on single aggregate operations (e.g., `save(user)`, `findById(id)`). Handle mapping between domain & Prisma. | **Benefit:** DDD repositories provide stronger abstraction. Mapping logic is centralized. Use cases interact with domain objects, not DB structures. Decouples domain from Prisma.                                                               |
| **9. Event Handling**   | `EventEmitter2` handles application-level events. Listeners subscribe to string topics.                               | `DomainEvents` dispatcher handles domain events. Listeners subscribe to specific `DomainEvent` classes.                                                   | **Benefit:** DDD event handling is strongly typed and directly tied to domain concepts. Dispatch timing (post-transaction) ensures consistency.                                                                                                     |

---

## 4. Summary of Benefits & Trade-offs (DDD Approach for Signup)

**Benefits:**

*   **Clearer Domain Model:** Business rules for User/Account creation and verification are encapsulated within the respective domain entities.
*   **Improved Testability:** `User`, `Account`, `Password`, etc., can be unit tested without database or framework dependencies. Use cases can be tested by mocking repositories that return domain objects.
*   **Enhanced Decoupling:** Domain logic is decoupled from persistence (Prisma) via repositories and mapping. Side effects (emailing) are decoupled from core logic via domain events.
*   **Increased Maintainability:** Changes to business rules are localized within domain entities. Changes to persistence only affect repositories.
*   **Consistency:** Aggregate roots and post-transaction event dispatch help ensure data consistency and reliable side effects.

**Trade-offs:**

*   **Increased Boilerplate:** Requires defining domain classes, value objects, event classes, repository interfaces, and mapping logic.
*   **Learning Curve:** Requires understanding DDD concepts.
*   **Mapping Overhead:** Repositories need explicit logic to map between domain classes and Prisma types.

**Conclusion:**

While the current implementation works and leverages NestJS patterns effectively, adopting the richer DDD entity pattern offers significant advantages for long-term maintainability, testability, and clarity of the domain model, especially as the application complexity grows. The key shift is moving business logic and state management into domain entities and using repositories solely for persistence and mapping, orchestrated by the use case.
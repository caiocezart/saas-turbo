import { Module } from "@nestjs/common";
import { AccountService } from "./services/account.service";
import { CryptoService } from "./services/crypto.service";
import { VerificationService } from "./services/verification.service";
import { TokenService } from "./services/token.service";
import { EnvModule } from "@/core/env/env.module";
import { DatabaseModule } from "@/core/database/database.module";
import { SignUpUseCase } from "./use-cases/sign-up.use-case";
import { SignInUseCase } from "./use-cases/sign-in.use-case";
// import { SignOutUseCase } from "./use-cases/
import { RefreshTokenUseCase } from "./use-cases/refresh-token.use-case";
import { ForgotPasswordUseCase } from "./use-cases/forgot-password.use-case";
import { ChangePasswordUseCase } from "./use-cases/change-password.use-case";
import { OtpRequestUseCase } from "./use-cases/otp-request.use-case";
import { NewEmailVerificationUseCase } from "./use-cases/new-email-verification.use-case";
import { VerifyEmailUserUseCase } from "./use-cases/verify-email.use-case";
import { AuthController } from "./controllers/auth.controller";
import { UsersController } from "./controllers/user.controller";
import { EmailOtpRequestedListener } from "./events/listeners/email-otp-requested.listener";
import { SignedUpUserListener } from "./events/listeners/signed-up-user.listener";
import { PasswordUpdatedListener } from "./events/listeners/password-updated.listener";
import { VerifyEmailListener } from "./events/listeners/email-verification.listener";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RefreshTokenGuard } from "./guards/refresh-token.guard";
import { AccountRepository } from "./repositories/account.repository";
import { RefreshTokenRepository } from "./repositories/refresh-token.repository";
import { UserRepository } from "./repositories/user.repository";
import { VerificationRepository } from "./repositories/verification.repository";
import { AccessTokenStrategy } from "./strategies/access-token.strategy";
import { RefreshTokenStrategy } from "./strategies/refresh-token.strategy";
import { APP_GUARD } from "@nestjs/core";
@Module({
  imports: [EnvModule, DatabaseModule],
  controllers: [AuthController, UsersController],
  providers: [
    // Guards
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RefreshTokenGuard,
    },
    // Strategies
    AccessTokenStrategy,
    RefreshTokenStrategy,
    // Services
    AccountService,
    CryptoService,
    TokenService,
    VerificationService,
    // Repositories
    AccountRepository,
    RefreshTokenRepository,
    UserRepository,
    VerificationRepository,
    // Events
    EmailOtpRequestedListener,
    SignedUpUserListener,
    PasswordUpdatedListener,
    VerifyEmailListener,
    // Use Cases
    SignUpUseCase,
    SignInUseCase,

    // SignOutUseCase,
    RefreshTokenUseCase,
    ForgotPasswordUseCase,
    ChangePasswordUseCase,
    OtpRequestUseCase,
    VerifyEmailUserUseCase,
    NewEmailVerificationUseCase,
  ],
  exports: [],
})
export class AuthModule {}

import { Module } from "@nestjs/common";
import { DatabaseModule } from "@/database/database.module";
import { EventsModule } from "@/events/events.module";

import { VerificationService } from "./auth/services/verification.service";
import { TokenService } from "./auth/services/token.service";
import { CryptoService } from "./auth/services/crypto.service";

import { RefreshTokenUseCase } from "./auth/refresh-token.use-case";
import { SignUpUseCase } from "./auth/sign-up.use-case";
import { SignInUseCase } from "./auth/sign-in-use-case";
import { VerifyEmailUserUseCase } from "./auth/verify-email.use-case";
import { NewEmailVerificationUseCase } from "./auth/new-email-verification.use-case";
import { OtpRequestUseCase } from "./auth/otp-request.use-case";
import { ForgotPasswordUseCase } from "./auth/forgot-password.use-case";
import { AccountService } from "./auth/services/account.service";
import { OrganizationService } from "./organizations/services/organization.service";
import { MembershipInviteService } from "./organizations/services/membership-invite.service";
import { CreateOrganizationUseCase } from "./organizations/create-organization.use-case";
import { GetOrganizationUseCase } from "./organizations/get-organization.use-case";
import { UpdateOrganizationUseCase } from "./organizations/update-organization.use-case";
import { DeleteOrganizationUseCase } from "./organizations/delete-organization.use-case";
import { CreateMembershipInviteUseCase } from "./organizations/create-membership-invite.use-case";
@Module({
  imports: [DatabaseModule, EventsModule],
  providers: [
    VerificationService,
    SignUpUseCase,
    VerifyEmailUserUseCase,
    NewEmailVerificationUseCase,
    RefreshTokenUseCase,
    SignInUseCase,
    TokenService,
    CryptoService,
    OtpRequestUseCase,
    ForgotPasswordUseCase,
    AccountService,
    OrganizationService,
    MembershipInviteService,
    GetOrganizationUseCase,
    CreateOrganizationUseCase,
    UpdateOrganizationUseCase,
    DeleteOrganizationUseCase,
    CreateMembershipInviteUseCase,
  ],
  exports: [
    SignUpUseCase,
    VerifyEmailUserUseCase,
    NewEmailVerificationUseCase,
    SignInUseCase,
    RefreshTokenUseCase,
    OtpRequestUseCase,
    ForgotPasswordUseCase,
    OrganizationService,
    MembershipInviteService,
    CreateOrganizationUseCase,
    GetOrganizationUseCase,
    UpdateOrganizationUseCase,
    DeleteOrganizationUseCase,
    CreateMembershipInviteUseCase,
  ],
})
export class UseCasesModule {}

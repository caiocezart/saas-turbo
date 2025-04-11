import { Module } from "@nestjs/common";
import { EnvModule } from "../env/env.module";
import { PrismaService } from "./prisma/prisma.service";
import { UserRepository } from "./repositories/user.repository";
import { AccountRepository } from "./repositories/account.repository";
import { ProviderRepository } from "./repositories/provider.repository";
import { VerificationRepository } from "./repositories/verification.repository";
import { RefreshTokenRepository } from "./repositories/refresh-token.repository";
import { OrganizationRepository } from "./repositories/organization.repository";
import { MembershipRepository } from "./repositories/membership.repository";
import { MembershipInviteRepository } from "./repositories/membership-invite.repository";
@Module({
  imports: [EnvModule],
  providers: [
    PrismaService,
    UserRepository,
    AccountRepository,
    ProviderRepository,
    VerificationRepository,
    RefreshTokenRepository,
    OrganizationRepository,
    MembershipRepository,
    MembershipInviteRepository,
  ],
  exports: [
    PrismaService,
    UserRepository,
    AccountRepository,
    ProviderRepository,
    VerificationRepository,
    RefreshTokenRepository,
    OrganizationRepository,
    MembershipRepository,
    MembershipInviteRepository,
  ],
})
export class DatabaseModule {}

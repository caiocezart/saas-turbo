import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "@/http/guards/jwt-auth.guard";
import { EnvModule } from "@/env/env.module";
import { DatabaseModule } from "@/database/database.module";
import { UseCasesModule } from "@/use-cases/use-cases.module";

import { AuthController } from "./controllers/auth.controller";
import { UsersController } from "./controllers/users.controller";

import { AccessTokenStrategy } from "./strategies/access-token.strategy";
import { OrganizationsController } from "./controllers/organizations.controller";
import { RefreshTokenStrategy } from "./strategies/refresh-token.strategy";
@Module({
  imports: [EnvModule, DatabaseModule, UseCasesModule],
  controllers: [AuthController, UsersController, OrganizationsController],
  providers: [
    AccessTokenStrategy,
    RefreshTokenStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class HttpModule {}

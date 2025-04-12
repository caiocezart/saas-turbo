import { Module } from "@nestjs/common";
import { DatabaseModule } from "@/core/database/database.module";
import { EnvService } from "./env/env.service";
import { AuthModule } from "./auth/auth.module";
import { EmailModule } from "./email/email.module";
import { EnvModule } from "./env/env.module";

@Module({
  imports: [AuthModule, DatabaseModule, EmailModule, EnvModule],
  providers: [EnvService],
})
export class CoreModule {}

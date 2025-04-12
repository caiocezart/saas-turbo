import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { envSchema } from "@/core/env/env";
import { EnvModule } from "@/core/env/env.module";
import { EnvService } from "@/core/env/env.service";
import { JwtModule } from "@nestjs/jwt";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { CoreModule } from "./core/core.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    CoreModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      global: true,

      useFactory(env: EnvService) {
        const privateKey = env.get("JWT_PRIVATE_KEY");
        const publicKey = env.get("JWT_PUBLIC_KEY");

        return {
          signOptions: { algorithm: "RS256" },
          privateKey: Buffer.from(privateKey, "base64"),
          publicKey: Buffer.from(publicKey, "base64"),
          passReqToCallback: true,
          ignoreExpiration: false,
          logger: false,
        };
      },
    }),
    EventEmitterModule.forRoot(),
    // LoggerModule.forRootAsync({
    //   imports: [EnvModule],
    //   inject: [EnvService],
    //   useFactory: async (env: EnvService) => {
    //     return {
    //       pinoHttp: {
    //         level: env.get("LOG_LEVEL"),
    //       },
    //       genReqId: (request) =>
    //         request.headers["x-correlation-id"] || uuidv4(),
    //       transport:
    //         process.env.NODE_ENV !== "production"
    //           ? { target: "pino-pretty" }
    //           : undefined,
    //     };
    //   },
    // }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

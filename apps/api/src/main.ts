import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import { NestFactory } from "@nestjs/core";
import { NestFastifyApplication } from "@nestjs/platform-fastify";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { AppExceptionFilter } from "./core/shared/exceptions/exception-filter";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true })
  );

  // app.useLogger(app.get(Logger));

  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
  });
  await app.register(fastifyCors, {
    origin: process.env.CORS_ORIGINS?.split(",") || ["http://localhost:3001"],
    credentials: true,
  });
  await app.register(fastifyHelmet);

  const apiPrefix = process.env.API_PREFIX || "api/v1";

  app.setGlobalPrefix(apiPrefix);
  // app.use(RequestIdMiddleware);
  app.useGlobalFilters(new AppExceptionFilter());

  const port = process.env.BACKEND_PORT || 3001;
  await app.listen(port, "0.0.0.0");
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}

bootstrap();

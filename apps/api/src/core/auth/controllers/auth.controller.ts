import { Body, Controller, Logger, Post, Res, UseGuards } from "@nestjs/common";
import { SignInUseCase } from "../use-cases/sign-in.use-case";
import { VerifyEmailUserUseCase } from "../use-cases/verify-email.use-case";
import { RefreshTokenUseCase } from "../use-cases/refresh-token.use-case";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { SignUpUseCase } from "../use-cases/sign-up.use-case";
import { FastifyReply } from "fastify";
import { Public } from "../decorators/public.decorator";
import { NewEmailVerificationUseCase } from "../use-cases/new-email-verification.use-case";
import { OtpRequestUseCase } from "../use-cases/otp-request.use-case";
import { ForgotPasswordUseCase } from "../use-cases/forgot-password.use-case";
import { RequestPayload } from "../schemas/jwt-request-payload.schema";
import { Request } from "../decorators/request-payload.decorator";
import { RefreshTokenGuard } from "../guards/refresh-token.guard";
import { ChangePasswordUseCase } from "../use-cases/change-password.use-case";
import {
  signUpUserRequestDtoSchema,
  signInUserRequestDtoSchema,
  verifyUserEmailRequestDtoSchema,
  otpRequestRequestDtoSchema,
  forgotPasswordRequestDtoSchema,
  changePasswordRequestDtoSchema,
  SignUpUserRequestDto,
  SignInUserRequestDto,
  VerifyUserEmailRequestDto,
  OtpRequestRequestDto,
  ForgotPasswordRequestDto,
  ChangePasswordRequestDto,
} from "@repo/domain";
@Controller("auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly signUpUseCase: SignUpUseCase,
    private readonly signInUseCase: SignInUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUserUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly newEmailVerificationUseCase: NewEmailVerificationUseCase,
    private readonly otpRequestUseCase: OtpRequestUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase
  ) {}

  @Public()
  @Post("sign-up")
  async signup(
    @Res() res: FastifyReply,
    @Request() request: RequestPayload,
    @Body(new ZodValidationPipe(signUpUserRequestDtoSchema))
    body: SignUpUserRequestDto
  ) {
    const { accessToken, refreshToken } = await this.signUpUseCase.execute(
      request,
      body
    );
    this.setAuthCookies(res, accessToken, refreshToken.token);
  }

  @Public()
  @Post("sign-in")
  async signin(
    @Res() res: FastifyReply,
    @Request() request: RequestPayload,
    @Body(new ZodValidationPipe(signInUserRequestDtoSchema))
    body: SignInUserRequestDto
  ) {
    const { accessToken, refreshToken } = await this.signInUseCase.execute(
      request,
      body
    );
    this.setAuthCookies(res, accessToken, refreshToken.token);
    res.status(200).send();
  }

  @Post("verify-email")
  async verifyEmail(
    @Res() res: FastifyReply,
    @Request() request: RequestPayload,
    @Body(new ZodValidationPipe(verifyUserEmailRequestDtoSchema))
    body: VerifyUserEmailRequestDto
  ) {
    await this.verifyEmailUseCase.execute(request, body);
    res.status(200).send();
  }

  @Post("new-email-verification")
  async newEmailVerification(
    @Res() res: FastifyReply,
    @Request() request: RequestPayload
  ) {
    await this.newEmailVerificationUseCase.execute(request);
    res.status(200).send();
  }

  @Post("otp")
  async requestOtp(
    @Res() res: FastifyReply,
    @Request() request: RequestPayload,
    @Body(new ZodValidationPipe(otpRequestRequestDtoSchema))
    otpRequest: OtpRequestRequestDto
  ) {
    await this.otpRequestUseCase.execute(request, otpRequest);
    res.status(200).send();
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post("refresh-token")
  async refreshToken(
    @Res() res: FastifyReply,
    @Request() request: RequestPayload
  ) {
    const { accessToken, refreshToken } =
      await this.refreshTokenUseCase.execute(request);

    this.setAuthCookies(res, accessToken, refreshToken.token);
    res.status(200).send();
  }

  @Post("forgot-password")
  async forgotPassword(
    @Res() res: FastifyReply,
    @Request() request: RequestPayload,
    @Body(new ZodValidationPipe(forgotPasswordRequestDtoSchema))
    body: ForgotPasswordRequestDto
  ) {
    await this.forgotPasswordUseCase.execute(request, body);
    res.status(200).send();
  }

  @Post("change-password")
  async changePassword(
    @Res() res: FastifyReply,
    @Request() request: RequestPayload,
    @Body(new ZodValidationPipe(changePasswordRequestDtoSchema))
    body: ChangePasswordRequestDto
  ) {
    await this.changePasswordUseCase.execute(request, body);
    res.status(200).send();
  }

  private setAuthCookies(
    res: FastifyReply,
    accessToken: string,
    refreshToken: string
  ) {
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }
}

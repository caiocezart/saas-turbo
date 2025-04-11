import { Body, Controller, Logger, Post, Res, UseGuards } from "@nestjs/common";
import {
  SignUpUser,
  SignInUser,
  signInUserSchema,
  VerifyUserEmail,
  OtpRequest,
  ForgotPassword,
  signUpUserSchema,
  verifyUserEmailSchema,
  forgotPasswordSchema,
  otpRequestSchema,
} from "@repo/domain";
import { SignInUseCase } from "@/use-cases/auth/sign-in-use-case";
import { VerifyEmailUserUseCase } from "@/use-cases/auth/verify-email.use-case";
import { RefreshTokenUseCase } from "@/use-cases/auth/refresh-token.use-case";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { SignUpUseCase } from "@/use-cases/auth/sign-up.use-case";
import { FastifyReply } from "fastify";
import { Public } from "@/http/decorators/public.decorator";
import { NewEmailVerificationUseCase } from "@/use-cases/auth/new-email-verification.use-case";
import { OtpRequestUseCase } from "@/use-cases/auth/otp-request.use-case";
import { ForgotPasswordUseCase } from "@/use-cases/auth/forgot-password.use-case";
import { RequestPayload } from "@repo/domain";
import { Request } from "@/http/decorators/request-payload.decorator";
import { RefreshTokenGuard } from "../guards/refresh-token.guard";

const signUpBodyValidationPipe = new ZodValidationPipe(signUpUserSchema);
const signInBodyValidationPipe = new ZodValidationPipe(signInUserSchema);
const verifyEmailBodyValidationPipe = new ZodValidationPipe(
  verifyUserEmailSchema
);
const otpRequestBodyValidationPipe = new ZodValidationPipe(otpRequestSchema);
const forgotPasswordBodyValidationPipe = new ZodValidationPipe(
  forgotPasswordSchema
);

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
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase
  ) {}

  @Public()
  @Post("sign-up")
  async signup(
    @Res() res: FastifyReply,
    @Request() request: RequestPayload,
    @Body(signUpBodyValidationPipe) body: SignUpUser
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
    @Body(signInBodyValidationPipe) body: SignInUser
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
    @Body(verifyEmailBodyValidationPipe) body: VerifyUserEmail
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
    @Body(otpRequestBodyValidationPipe) otpRequest: OtpRequest
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
    @Body(forgotPasswordBodyValidationPipe) body: ForgotPassword
  ) {
    await this.forgotPasswordUseCase.execute(request, body);
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

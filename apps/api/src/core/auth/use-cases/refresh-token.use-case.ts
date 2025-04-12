import { Injectable, UnauthorizedException } from "@nestjs/common";
import { TokenService } from "../services/token.service";
import { RefreshTokenRepository } from "../repositories/refresh-token.repository";
import { RequestPayload } from "../schemas/jwt-request-payload.schema";
import { ErrorCode } from "@repo/domain";

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly tokenService: TokenService,
    private readonly refreshTokenRepository: RefreshTokenRepository
  ) {}

  async execute(request: RequestPayload) {
    if (!request.refreshToken) {
      throw new UnauthorizedException(ErrorCode.REFRESH_TOKEN_INVALID);
    }

    const userId = request.user.sub;

    const dbRefreshToken = await this.refreshTokenRepository.findRefreshToken(
      request.refreshToken
    );

    if (!dbRefreshToken || dbRefreshToken.user.id !== userId) {
      throw new UnauthorizedException(ErrorCode.REFRESH_TOKEN_INVALID);
    }

    const { accessToken, refreshToken } = await this.tokenService.signTokens(
      request.ip ?? "unknown",
      userId,
      {
        sub: userId,
        email: dbRefreshToken.user.email,
        name: dbRefreshToken.user.name,
      }
    );

    return { accessToken, refreshToken };
  }
}

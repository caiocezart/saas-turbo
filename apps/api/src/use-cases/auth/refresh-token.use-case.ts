import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ErrorCode, RequestPayload } from "@repo/domain";
import { TokenService } from "./services/token.service";
import { UserRepository } from "@/database/repositories/user.repository";
import { RefreshTokenRepository } from "@/database/repositories/refresh-token.repository";

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly tokenService: TokenService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly userRepository: UserRepository
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

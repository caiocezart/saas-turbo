import { JwtService } from "@nestjs/jwt";
import { Injectable, Logger } from "@nestjs/common";
import { JwtAccessToken, TimeInMilliseconds } from "@repo/domain";
import { RefreshTokenRepository } from "@/database/repositories/refresh-token.repository";
import { AppException } from "@/shared/exceptions/app.exception";
import { ErrorCode } from "@repo/domain";

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepository: RefreshTokenRepository
  ) {}

  async signTokens(userIp: string, userId: string, payload: JwtAccessToken) {
    await this.refreshTokenRepository.deleteUserRefreshTokens(userId);

    const accessToken = await this.signAccessToken(payload);
    const refreshToken = await this.signRefreshToken({
      sub: payload.sub,
    });

    // save refresh token to db
    // on try catch to ensure it only returns to the user if the refresh token is saved
    try {
      await this.refreshTokenRepository.saveRefreshToken({
        token: refreshToken.token,
        expiresAt: refreshToken.expiresAt,
        createdByIp: userIp,
        userId: userId,
      });
    } catch (error) {
      throw new AppException(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Error saving refresh token"
      );
    }

    return { accessToken, refreshToken };
  }

  private async signAccessToken(payload: object) {
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: TimeInMilliseconds.ONE_MINUTE.toString(),
    });
    this.logger.debug("token decoded:", this.jwtService.decode(accessToken));

    return accessToken;
  }

  private async signRefreshToken(payload: object) {
    const expirationTime = TimeInMilliseconds.TWO_MINUTES.toString();
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: expirationTime,
    });
    this.logger.debug("token decoded:", this.jwtService.decode(token));

    const expiresAt = new Date(Date.now() + TimeInMilliseconds.TWO_MINUTES);

    return {
      token,
      expiresAt,
    };
  }
}

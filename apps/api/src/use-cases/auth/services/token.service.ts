import { JwtService } from "@nestjs/jwt";
import { Injectable, Logger } from "@nestjs/common";
import { JwtAccessToken, TimeInMilliseconds, ErrorCode } from "@repo/domain";
import { RefreshTokenRepository } from "@/database/repositories/refresh-token.repository";
import { AppException } from "@/shared/exceptions/app.exception";
import { Prisma } from "@prisma/client"; // Correct import for Prisma types

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepository: RefreshTokenRepository
  ) {}

  async signTokens(
    userIp: string,
    userId: string,
    payload: JwtAccessToken,
    tx?: Prisma.TransactionClient // Add optional tx parameter
  ) {
    // Pass tx to repository method
    await this.refreshTokenRepository.deleteUserRefreshTokens(userId, tx);

    const accessToken = await this.signAccessToken(payload);
    const refreshToken = await this.signRefreshToken({
      sub: payload.sub,
    });

    // save refresh token to db
    // on try catch to ensure it only returns to the user if the refresh token is saved
    try {
      await this.refreshTokenRepository.saveRefreshToken(
        {
          token: refreshToken.token,
          expiresAt: refreshToken.expiresAt,
          createdByIp: userIp,
          userId: userId,
        },
        tx // Pass tx to repository method
      );
    } catch (error) {
      this.logger.error(`Error saving refresh token for user ${userId}`, error);
      throw new AppException(
        ErrorCode.INTERNAL_SERVER_ERROR,
        "Error saving refresh token"
      );
    }

    // Return the tokens after successful save
    return { accessToken, refreshToken };
  }

  private async signAccessToken(payload: object) {
    const accessToken = await this.jwtService.signAsync(payload, {
      // TODO: Use config for expiration time
      expiresIn: TimeInMilliseconds.FIFTEEN_MINUTES.toString(), // Increased expiration for practical use
    });
    this.logger.debug(
      "Access token decoded:",
      this.jwtService.decode(accessToken)
    );
    return accessToken;
  }

  private async signRefreshToken(payload: object) {
    // TODO: Use config for expiration time
    const expirationTimeMs = TimeInMilliseconds.ONE_WEEK; // Corrected enum member
    const expirationTimeSec = expirationTimeMs / 1000; // jwtService expects seconds or string like '7d'

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: `${expirationTimeSec}s`, // Use seconds or string format
    });
    this.logger.debug("Refresh token decoded:", this.jwtService.decode(token));

    const expiresAt = new Date(Date.now() + expirationTimeMs);

    return {
      token,
      expiresAt,
    };
  }
}

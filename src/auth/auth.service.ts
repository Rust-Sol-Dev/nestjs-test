import {
  UnauthorizedException,
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import {
  EmailJwtDto,
  JwtDto,
  JwtPayload,
  EmailPayload,
} from "common/types/authorization";
import { SecurityConfig } from "common/configs/config.interface";
import { pick } from "lodash";
import { User } from "user/user.entity";
import { UserRepository } from "user/user.repository";

const sanitizePayload = (payload: JwtPayload) => {
  return pick(payload, "type", "id", "email", "name", "role");
};

// One day  we can consider splitting this into two passport strategies
@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository
  ) {}
  authorizeUser(user: User) {
    return {
      accessToken: this.generateAccessToken({ ...user, type: "user" }),
      refreshToken: this.generateRefreshToken({ ...user, type: "user" }),
    };
  }

  /** @deprecated */
  signEmail(email: string, expiresIn = "7d"): string {
    const signedEmail = this.jwtService.sign(
      { email },
      { secret: this.configService.get("JWT_ACCESS_SECRET"), expiresIn }
    );
    return signedEmail;
  }

  /** @deprecated */
  decodeEmail(emailToken: string) {
    const emailJwtDto = this.jwtService.decode(emailToken);

    if (
      typeof emailJwtDto === "object" &&
      "email" in emailJwtDto &&
      typeof emailJwtDto.email === "string"
    ) {
      return emailJwtDto.email;
    } else throw new BadRequestException("Malformed email token");
  }

  private generateAccessToken(payload: JwtPayload): string {
    const sanitizedPayload = sanitizePayload(payload);
    const accessToken = `Bearer ${this.jwtService.sign(sanitizedPayload)}`;
    return accessToken;
  }

  private generateRefreshToken(payload: JwtPayload): string {
    const sanitizedPayload = sanitizePayload(payload);
    const securityConfig = this.configService.get<SecurityConfig>("security");

    const refreshToken = this.jwtService.sign(sanitizedPayload, {
      secret: this.configService.get("JWT_REFRESH_SECRET"),
      expiresIn: securityConfig.refreshIn,
    });

    return refreshToken;
  }

  generateEmailToken(id: number, email: string, expiresIn = "7d") {
    return this.jwtService.sign(
      { email, id },
      {
        secret: this.configService.get("JWT_ACCESS_SECRET"),
        expiresIn,
      }
    );
  }

  verifyEmailToken(token: string): EmailPayload {
    let emailJwtDto: EmailJwtDto;
    try {
      emailJwtDto = this.jwtService.verify<EmailJwtDto>(token, {
        secret: this.configService.get("JWT_ACCESS_SECRET"),
      });
    } catch {
      throw new UnauthorizedException("Session token expired, new email sent");
    }

    if (
      typeof emailJwtDto === "object" &&
      "email" in emailJwtDto &&
      "id" in emailJwtDto
    ) {
      return {
        email: emailJwtDto.email,
        id: emailJwtDto.id,
      };
    } else throw new BadRequestException("Malformed email token");
  }

  async refreshAccessToken(token: string) {
    let jwtDto: JwtDto;
    try {
      jwtDto = this.jwtService.verify<JwtDto>(token, {
        secret: this.configService.get("JWT_REFRESH_SECRET"),
      });
    } catch {
      throw new UnauthorizedException("Authorization expired");
    }

    const user = await this.userRepository.findOne({
      where: { id: jwtDto.id },
    });

    return this.generateAccessToken({ ...user, type: "user" });
  }

  async validateJwt(jwtDto: JwtDto): Promise<JwtPayload> {
    if (jwtDto.type === "user") {
      const user = await this.userRepository.findOneBy({
        id: jwtDto.id,
      });

      if (!user) throw new NotFoundException("User not found");
      return { ...user, type: "user" };
    } else {
      throw new ForbiddenException("Authorization type unknown");
    }
  }
}

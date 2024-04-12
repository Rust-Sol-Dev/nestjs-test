import { ApiProperty } from "@nestjs/swagger";
import { User } from "user/user.entity";

export class Authorization {
  @ApiProperty({ description: `Access Token`, type: String })
  accessToken: string;

  @ApiProperty({ description: `Access Token`, type: String })
  refreshToken: string;
}

export type BaseJwtPayload = {
  /** Issued at */
  iat: number;
  /** Expiration time */
  exp: number;
};

export type UserPayload = {
  type: "user";
  id: User["id"];
  email: User["email"];
  name: User["name"];
  role: User["role"];
};

export type JwtPayload = UserPayload;
export type JwtDto = JwtPayload & BaseJwtPayload;

export type EmailPayload = {
  email: string;
  id: number; // user or creator id
};
export type EmailJwtDto = EmailPayload & BaseJwtPayload;

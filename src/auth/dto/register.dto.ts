import {
  IsEmail,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from "class-validator";
import {
  PASSWORD_OPTIONS,
  USERNAME_MAX_SIZE,
  USERNAME_MIN_SIZE,
} from "common/utils/constants";

export class RegisterDto {
  // @IsValidUsername()
  @MinLength(USERNAME_MIN_SIZE)
  @MaxLength(USERNAME_MAX_SIZE)
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword(PASSWORD_OPTIONS)
  password: string;
}

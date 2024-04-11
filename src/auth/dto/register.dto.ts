import {
  IsEmail,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from "class-validator";
import {
  USERNAME_MIN_SIZE,
  USERNAME_MAX_SIZE,
  PASSWORD_OPTIONS,
} from "src/constants";

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

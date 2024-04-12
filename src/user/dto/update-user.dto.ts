import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, MaxLength, MinLength } from "class-validator";
import { USERNAME_MAX_SIZE, USERNAME_MIN_SIZE } from "common/utils/constants";

export class UpdateUserDto {
  @ApiProperty({
    example: "magnate",
    required: false,
    minimum: 2,
    maximum: 20,
    description: "username",
  })
  @MinLength(USERNAME_MIN_SIZE)
  @MaxLength(USERNAME_MAX_SIZE)
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: "user@example.com",
    required: false,
    maximum: 255,
    description: "E-mail",
  })
  @IsEmail()
  @IsOptional()
  email?: string;
}

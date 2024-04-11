import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class CreateCatDto {
  @ApiProperty({
    example: "meox1",
    required: true,
    description: "cat name",
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: "2",
    required: true,
    description: "cat age",
  })
  @IsInt()
  readonly age: number;

  @ApiProperty({
    example: "r",
    required: true,
    description: "cat breed",
  })
  @IsString()
  readonly breed: string;
}

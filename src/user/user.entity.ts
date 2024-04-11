import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import {
  Column,
  Entity,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from "typeorm";

export enum Role {
  CUSTOMER = "Customer",
  ADMIN = "Admin",
}

@Entity("user")
export class User {
  @ApiProperty({ description: `Unique uuid`, maximum: 36 })
  @Column({ type: "varchar", nullable: false, length: 36 })
  id: string;

  @ApiProperty({ description: "Display name", maximum: 128, required: true })
  @Column({ type: "varchar", nullable: true, length: 128 })
  name: string;

  @ApiProperty({
    description: "E-mail",
    maximum: 255,
    required: true,
    uniqueItems: true,
  })
  @Column({ type: "varchar", nullable: true, length: 255 })
  email: string;

  @ApiProperty({ description: "Password", maximum: 128, required: true })
  @Column({ type: "varchar", nullable: true, length: 128 })
  password: string;

  @ApiProperty({ description: "Role", maximum: 255, required: true })
  @Column({ type: "enum", enum: Role, nullable: false, default: Role.CUSTOMER })
  role: Role;

  @ApiProperty({
    description: "Date when the user last logined",
    required: true,
  })
  @UpdateDateColumn()
  lastLogin: Date;

  @ApiProperty({
    description: "Date when the user verified email",
    required: true,
  })
  @CreateDateColumn()
  emailVerifiedAt: Date;

  @ApiProperty({
    description: "Date when the user was created",
    required: true,
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: "Date when user was updated the last time",
    required: false,
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude({ toPlainOnly: true })
  @DeleteDateColumn()
  deletedAt: Date;
}

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

@Entity("cat")
export class Cat {
  @ApiProperty({ description: `Unique uuid`, maximum: 36 })
  @Column({ type: "varchar", nullable: false, length: 36 })
  id: string;

  @ApiProperty({ description: "Cat name", maximum: 128, required: true })
  @Column({ type: "varchar", nullable: false, length: 128 })
  name: string;

  @ApiProperty({ description: "Cat age", default: 1 })
  @Column({ type: "integer", nullable: false, default: 1 })
  age: number;

  @ApiProperty({ description: "Cat breed", maximum: 128, required: true })
  @Column({ type: "varchar", nullable: false, length: 128 })
  breed: string;

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

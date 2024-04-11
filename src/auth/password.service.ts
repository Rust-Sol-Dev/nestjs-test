import { Injectable, BadRequestException } from "@nestjs/common";
import * as bcrypt from "bcrypt";

@Injectable()
export class PasswordService {
  constructor() {}

  async hash(password: string, saltOrRound: string) {
    return await bcrypt.hash(password, saltOrRound);
  }

  async validate(password: string, hashedPassword: string) {
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      throw new BadRequestException("Incorrect password!");
    }
  }
}

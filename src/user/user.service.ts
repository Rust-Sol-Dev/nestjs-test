import { BadRequestException, Injectable, Logger } from "@nestjs/common";

import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";
import { LoginDto } from "@auth/dto/login.dto";
import { RegisterDto } from "@auth/dto/register.dto";
import { PasswordService } from "@auth/password.service";
import { validateEmail, validateName } from "@common/utils/user";
import { isEmail } from "class-validator";

@Injectable()
export class UserService {
  private logger: Logger;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService
  ) {
    this.logger = new Logger(UserService.name);
  }

  async findById(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByName(name: string): Promise<User> {
    return this.userRepository.findOne({ where: { name } });
  }

  async update(id: string, body: UpdateUserDto): Promise<User> {
    await this.userRepository.update(
      { id },
      this.userRepository.create({ ...body })
    );

    return this.findById(id);
  }

  async create(body: RegisterDto): Promise<User> {
    const userEntity: Partial<User> = {
      ...this.userRepository.create(body),
    };

    const user = await this.userRepository.save(userEntity, { reload: false });

    return this.findById(user.id);
  }

  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;

    validateName(name);
    validateEmail(email);

    const [hashedPassword] = await Promise.all([
      password && this.passwordService.hash(password, "SALT"),
    ]);

    const user = await this.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }

  async login(loginDto: LoginDto) {
    const { nameOrEmail, password } = loginDto;

    if (!nameOrEmail) {
      throw new BadRequestException("Please provide email or username");
    }

    let user: User;
    if (isEmail(nameOrEmail)) {
      user = await this.findByEmail(nameOrEmail);
    } else {
      user = await this.findByName(nameOrEmail);
    }

    if (!user.password.length) {
      throw new BadRequestException(
        "This account is already linked to a Google Account. Please use google sign in."
      );
    }

    await this.passwordService.validate(password, user.password);
    await this.userRepository.update(
      { id: user.id },
      { lastLogin: new Date() }
    );

    return await this.findById(user.id);
  }
}

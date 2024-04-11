import { Module, forwardRef } from "@nestjs/common";

import { AuthModule } from "@auth/auth.module";
import { UserExistsByEmailValidator } from "./validator/user-exists-by-email.validator";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";
import { PasswordService } from "@auth/password.service";

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [],
  providers: [
    UserService,
    PasswordService,
    UserRepository,
    UserExistsByEmailValidator,
  ],
  exports: [UserService, UserRepository],
})
export class UserModule {}

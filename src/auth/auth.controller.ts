import {
  Controller,
  Get,
  Post,
  Param,
  Patch,
  UseGuards,
  Body,
  HttpStatus,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { SkipThrottle, Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { UserService } from "../user/user.service";
import { ApiResponseHelper } from "@common/helpers/api-response.helper";
import { Authorization } from "@common/types/authorization";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
@UseGuards(ThrottlerGuard)
@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  /* Register a new user */
  @ApiOperation({ description: `User register`, tags: ["Auth"] })
  @ApiResponse(ApiResponseHelper.success(Authorization, HttpStatus.CREATED))
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post("register")
  async registerUser(@Body() registerDto: RegisterDto): Promise<Authorization> {
    const user = await this.userService.register(registerDto);
    return this.authService.authorizeUser(user);
  }

  /* Login as a user */
  @ApiOperation({ description: `User login`, tags: ["Auth"] })
  @ApiResponse(ApiResponseHelper.success(Authorization, HttpStatus.CREATED))
  @ApiResponse(ApiResponseHelper.validationError(`Validation failed`))
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Patch("login")
  async loginUser(@Body() loginDto: LoginDto): Promise<Authorization> {
    const user = await this.userService.login(loginDto);
    return this.authService.authorizeUser(user);
  }

  /* Refresh access token */
  @ApiOperation({ description: `Regenerate refresh token`, tags: ["Auth"] })
  @ApiResponse(ApiResponseHelper.success(String, HttpStatus.CREATED))
  @ApiResponse(ApiResponseHelper.validationError(`Validation failed`))
  @SkipThrottle()
  @Patch("refresh-token/:refreshToken")
  async reauthorizeUser(@Param("refreshToken") refreshToken: string) {
    return await this.authService.refreshAccessToken(refreshToken);
  }
}

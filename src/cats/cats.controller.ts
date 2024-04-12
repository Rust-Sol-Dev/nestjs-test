import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { SkipThrottle, Throttle } from "@nestjs/throttler";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { RolesGuard } from "../common/guards/roles.guard";
import { ApiResponseHelper } from "common/helpers/api-response.helper";
import { Authorization } from "common/types/authorization";
import { Roles } from "common/decorators/roles.decorator";
import { CatsService } from "./cats.service";
import { CreateCatDto } from "./dto/create-cat.dto";
import { Cat } from "./cats.entity";

@UseGuards(RolesGuard)
@Controller("cats")
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  /* Register a new user */
  @ApiOperation({ description: `Cat creation`, tags: ["Admin"] })
  @ApiResponse(ApiResponseHelper.success(Authorization, HttpStatus.CREATED))
  @Throttle({ default: { limit: 10, ttl: 30000 } })
  @Post()
  @Roles(["admin"])
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @ApiOperation({ description: `Get all cats` })
  @SkipThrottle()
  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @ApiOperation({ description: `Get cat by Id` })
  @SkipThrottle()
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.catsService.findById(+id);
  }

  @ApiOperation({ description: `Cat admin`, tags: ["Admin"] })
  @ApiResponse(ApiResponseHelper.success(Authorization, HttpStatus.CREATED))
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Put(":id")
  @Roles(["admin"])
  update(@Param("id") id: string, @Body() data: CreateCatDto) {
    return this.catsService.update(+id, data);
  }

  @ApiOperation({ description: `Cat creation`, tags: ["Admin"] })
  @ApiResponse(ApiResponseHelper.success(Authorization, HttpStatus.CREATED))
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Delete(":id")
  @Roles(["admin"])
  delete(@Param("id") id: string) {
    return this.catsService.delete(+id);
  }
}

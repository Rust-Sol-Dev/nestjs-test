import { Module } from "@nestjs/common";
import { CoreModule } from "@core/core.module";
import { AuthModule } from "@auth/auth.module";
import { UserModule } from "@user/user.module";
import { CatsModule } from "@cats/cats.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ThrottlerModule } from "@nestjs/throttler";
import {
  SecurityConfig,
  ThrottleConfig,
} from "@common/configs/config.interface";
import databaseConfig from "@common/configs/database.config";
import config from "@common/configs/config";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config, databaseConfig] }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const securityConfig = configService.get<SecurityConfig>("security");
        return {
          secret: configService.get<string>("JWT_ACCESS_SECRET"),
          signOptions: { expiresIn: securityConfig.expiresIn },
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const config = configService.get("databaseConfig");
        return {
          ...config,
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const throttleConfig = configService.get<ThrottleConfig>("throttle");
        return [
          {
            ttl: throttleConfig.ttl,
            limit: throttleConfig.limit,
            ignoreUserAgents: throttleConfig.ignoreUserAgents,
          },
        ];
      },
    }),
    CoreModule,
    AuthModule,
    UserModule,
    CatsModule,
  ],
})
export class AppModule {}

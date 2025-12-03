import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/user/user.module";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy";

@Module({
    imports: [UserModule, ConfigModule, JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})

export class AuthModule {}
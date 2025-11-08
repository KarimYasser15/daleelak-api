import { Module } from "@nestjs/common";
import { GuideController } from "./guide.controller";
import { GuideService } from "./guide.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { Guide } from "../user/entities/guide.entity";

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: 'jwt-service',
                signOptions: { expiresIn: '24hr' },
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([User, Guide]),
    ],
    controllers: [GuideController],
    providers: [GuideService]
})
export class GuideModule {

}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/entities/user.entity';
import { AuthModule } from './modules/auth/auth.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GuideModule } from './modules/guides/guide.module';
import { Guide } from './modules/user/entities/guide.entity';
import { GuideComment } from './modules/guides/entities/guide-comment.entity';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DATABASE_HOST'),
                port: parseInt(configService.get('DATABASE_PORT'), 10),
                username: configService.get('DATABASE_USERNAME'),
                password: configService.get('DATABASE_PASSWORD'),
                database: configService.get('DATABASE_NAME'),
                entities: [
                    User,
                    Guide,
                    GuideComment
                ],
                synchronize: configService.get('DATABASE_SYNCHRONIZE') === 'true',
                ssl: false,
            }),
            inject: [ConfigService],
        }),
        AuthModule,
        GuideModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
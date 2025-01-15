import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/task/entities/task.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
    imports:[
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.getOrThrow("POSTGRES_HOST"),
                port: +configService.getOrThrow("POSTGRES_PORT"),
                database: configService.getOrThrow("POSTGRES_DB"),
                username: configService.getOrThrow("POSTGRES_USER"),
                password: configService.getOrThrow("POSTGRES_PASSWORD"),
                entities: [User, Task],
                synchronize: configService.getOrThrow("POSTGRES_SYNCHRONISE")
            }),
            inject: [ConfigService]
        })
    ]
})
export class DatabaseModule {}

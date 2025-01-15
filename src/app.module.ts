import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true}),
    JwtModule.registerAsync({
      imports:[ConfigModule],
      useFactory: async (config) => ({
        secret: config.getOrThrow('JWT_SECRET'),
        expiresIn: '1h'
      }),
      global: true,
      inject: [ConfigService]
    }), 
    UserModule, 
    TaskModule, 
    DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

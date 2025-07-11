import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports : [ConfigModule],
      global : true,
      useFactory  : async  (configService : ConfigService)  => ({
        secret : configService.get('JWT_SECRET')
      }),
      inject : [ConfigService]

    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports : [ConfigModule],
      inject : [ConfigService],
      useFactory : (configService : ConfigService) => ({
        type : 'postgres',
        host : configService.get('DB_HOST'),
        port : configService.get('DB_PORT'),
        username : configService.get('DB_USERNAME'),
        password : configService.get('DB_PASSWORD'),
        database : configService.get('DB_NAME'),
        entities : [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize : true,// i have to disable it when the app is in production
      })
    }),
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}

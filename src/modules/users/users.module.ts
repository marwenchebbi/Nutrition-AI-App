import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';

@Module({
  imports :[
    TypeOrmModule.forFeature([User,RefreshToken])
    ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

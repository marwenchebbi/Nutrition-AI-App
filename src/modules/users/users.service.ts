import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { errors } from 'src/errors/errors';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}


  async create(createUserDto: CreateUserDto) {
    const {name, email, password} = createUserDto;
    const user = await this.userRepository.findOne({where : {email}});

    if(user){
      throw new BadRequestException(errors.emailInUse);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const saveduser = await this.userRepository.create({name, email, password : hashedPassword});
    return this.userRepository.save(saveduser);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

import { TypeHelpOptions } from './../../../node_modules/class-transformer/types/interfaces/type-help-options.interface.d';
import { RefreshToken } from './entities/refresh-token.entity';
import { LoginDTO } from './dto/login.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { errors } from 'src/errors/errors';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtservice : JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository : Repository<RefreshToken>
  ) {}

  // method to create a  user 
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

  async login(loginDTO : LoginDTO ){
    const {email, password} = loginDTO;
    const user = await this.userRepository.findOne({where : {email}})

    if(!user){
      throw new BadRequestException(errors.wrongCredentials);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
      throw new BadRequestException(errors.wrongCredentials);
    }


    const tokens = await this.generateTokens(user?.id)

    return tokens


  }

  async generateTokens(userId : number){
    const accessToken= await  this.jwtservice.sign({userId : userId},{expiresIn : '15m'}) 
    const refreshToken= await this.jwtservice.sign({userId : userId},{expiresIn : '7d'}) 

    await this.storeRefreshToken(refreshToken,userId)
    return {
      accessToken,
      refreshToken
    }
  }


  async storeRefreshToken(token: string, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
  
    if (!user) {
      throw new BadRequestException(errors.wrongCredentials);
    }
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);//3 days for expiration duration
  
    // Check if a refresh token already exists for the user
    const existingToken = await this.refreshTokenRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  
    if (existingToken) {
      // Overwrite existing token
      existingToken.token = token;
      existingToken.expiryDate = expiryDate;
      await this.refreshTokenRepository.save(existingToken);
    } else {
      // Create new token
      const newToken = this.refreshTokenRepository.create({
        token: token,
        expiryDate,
        user,
      });
      await this.refreshTokenRepository.save(newToken);
    }
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

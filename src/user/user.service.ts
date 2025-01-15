import { BadGatewayException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { SignInDTO } from './dto/signin-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>, 
  ){}

  async singup(createUserDto: CreateUserDto): Promise<User> {

    const {email, username, password}  =createUserDto;

    const userExist = await this.userRepository.findOne({ where: { email}})
    if(userExist) throw new BadGatewayException({message: "Email already in use"})

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({ ...createUserDto, password: hashedPassword });
    await this.userRepository.save(newUser)
    delete newUser.password;
    return newUser
  }

  async signin(signinDto: SignInDTO): Promise<{ user: User; accessToken: string }>{

    const {email, password}  = signinDto;

    const user = await this.userRepository.findOne({where : {email}})

    if(!user || !(await bcrypt.compare(password, user.password)))
        throw new BadGatewayException({message: "Bad Credentials"})

    const payload = { id: user.id};

    const accessToken = this.jwtService.sign(payload)

    delete user.password;
    return {user,accessToken:accessToken};

  }

  async findAll(): Promise<Partial<User>[]> {
    const users = await this.userRepository.find();
    return users.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
  }
  

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where : {id}, relations: ['tasks']})
    delete user.password;
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SignInDTO } from './dto/signin-user.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RoleGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { RoleEnum } from './enum/roles.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  signup(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.singup(createUserDto);
  }

  @Post('/signin')
  signin(@Body(ValidationPipe) singInDto: SignInDTO) {
    return this.userService.signin(singInDto);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.ADMIN)
  @Get()
  async findAll(@Request() req) {
    const loggedInUserId = req.user.id;

    const users = await this.userService.findAll();
    return users.filter((user) => user.id !== loggedInUserId);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.ADMIN)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('')
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.id;
    return this.userService.update(userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.userService.remove(id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SignInDTO } from './dto/signin-user.dto';
import { JwtAuthGuard } from './guards/jwt.guard';

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

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req) {
    const loggedInUserId = req.user.id;  

    const users = await this.userService.findAll(); 
    return users.filter(user => user.id !== loggedInUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}

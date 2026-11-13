import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  findMany(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
  ) {
    return this.usersService.findMany(Number(page), Number(pageSize));
  }
}

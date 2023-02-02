import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard, Public } from './guards/jwt-auth.guard';
import { CreateUserDto } from './user/dto/create-user.dto';
import { UserController } from './user/user.controller';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userController: UserController,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Post('/register')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.userController.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/history')
  getHistories(@Request() req) {
    return this.userController.getHistories(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/stats')
  getStats(@Request() req) {
    return this.userController.getStats(req);
  }
}

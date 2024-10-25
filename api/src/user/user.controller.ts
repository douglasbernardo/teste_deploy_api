import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from '../dto/user.dto';
import { editDto } from '../dto/edit_user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/new_user')
  addUser(@Body() userData: UserDto) {
    return this.userService.add_user(userData);
  }

  @UseGuards(AuthGuard)
  @Get('/all_users')
  allUsers() {
    return this.userService.get_all_users();
  }

  @UseGuards(AuthGuard)
  @Post()
  getUser(@Request() req) {
    return this.userService.find_user(req.body.currentEmail);
  }

  @UseGuards(AuthGuard)
  @Post('/edit_user')
  editUser(@Body() data: editDto) {
    return this.userService.edit_user(data);
  }

  @UseGuards(AuthGuard)
  @Post('/delete_account')
  deleteUser(@Request() req) {
    return this.userService.delete_account(req.body.currentEmail);
  }

  @UseGuards(AuthGuard)
  @Post('/my-activities')
  activities(@Request() req) {
    return this.userService.my_activities(req.body.email);
  }
}

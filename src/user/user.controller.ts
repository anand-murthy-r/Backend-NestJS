import { Controller, Get, UseGuards, Req, Patch, Body } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { getUser } from "../auth/decorator";
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}
    // GET /users/me
    @Get("me")
    getMe(@getUser() userId: number) { 
        return userId;
    }

    @Patch()
    editUser(@getUser('id') userId: number, @Body() dto: EditUserDto) {
        return this.userService.editUser(userId, dto);
    }
}

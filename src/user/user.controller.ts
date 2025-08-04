import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { getUser } from "../auth/decorator";

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    // GET /users/me

    @Get("me")
    getMe(@getUser() userId: number) { 
        return userId;
    }
}

import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


@Controller('users')
export class UserController {
    // GET /users/me

    @UseGuards(AuthGuard("jwt2"))
    @Get("me")
    getMe() {
        return "user info";
    }
}

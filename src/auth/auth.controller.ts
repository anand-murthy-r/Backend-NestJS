import { Controller, Post, Body, ParseIntPipe, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { AuthDtoSignUp, AuthDtoSignIn } from "./dto";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    // POST /auth/signup
    @HttpCode(HttpStatus.CREATED)
    @Post('signup')
    signup(@Body() dto: AuthDtoSignUp) {
        return this.authService.signup(dto);
    }

    // POST /auth/signin
    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signin(@Body() dto: AuthDtoSignIn) {
        return this.authService.signin(dto);
    }
    // @Get('records')
    // getAll() {
    //     return this.authService.temporaryFunction();
    // }
}
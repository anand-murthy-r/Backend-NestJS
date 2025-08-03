import { IsNotEmpty, IsEmail, IsString } from "class-validator"

export class AuthDtoSignUp {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;
}

export class AuthDtoSignIn {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;    
}
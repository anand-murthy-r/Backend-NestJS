import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDtoSignUp, AuthDtoSignIn } from "./dto";
import * as bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {
    }

    async signup(dto: AuthDtoSignUp) {

        // generate password hash
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(dto.password, saltRounds);
        try {     
            // save the new user in the db
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash: hashedPassword,
                    firstName: dto.firstName,
                    lastName: dto.lastName
                }
            });    
            // return the saved user
            const { hash, ...theRest } = user;
            return theRest;
        } catch(error) {
            if(error instanceof Prisma.PrismaClientKnownRequestError) {
                if(error.code === "P2002") throw new ForbiddenException("Email already registered.");
            }
        }
    }
    
    async signin(dto: AuthDtoSignIn) {
        // find user by email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        });
        // if user does not exist throw exception
        if(!user) throw new ForbiddenException("Credentials incorrect");
        // compare password
        const isMatch = await bcrypt.compare(dto.password, user.hash);
        // if password incorrect throw exception
        if (!isMatch) throw new ForbiddenException("Credentials incorrect");
        // if all ok send back user
        return this.signToken(user.id, user.email);
    }

    async signToken(userId: number, email: string): Promise<{access_token: string}> {
        const payload = {
            sub: userId,
            email: email
        }

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: this.config.get("JWT_SECRET")
        });

        return {
            access_token: token
        };
    }
}
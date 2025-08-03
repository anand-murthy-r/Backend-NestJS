import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDtoSignUp, AuthDtoSignIn } from "./dto";
import * as bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService) {
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
        const { hash, ...theRest } = user;
        return theRest;
    }

    // async temporaryFunction() {
    //     const users = await this.prisma.user.findMany();
    //     if(!users) throw new ForbiddenException("No users found");
    //     console.log(users);
    // }

}
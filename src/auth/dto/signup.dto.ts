import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class SignupDto {
    @IsNotEmpty()
    username: string;
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}
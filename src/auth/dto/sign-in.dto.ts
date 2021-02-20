import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator"

export class SignInDto {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    password: string
}
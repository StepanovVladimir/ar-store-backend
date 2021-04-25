import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator"

export class SignInDto {
    @IsEmail()
    email: string

    @MinLength(6)
    @MaxLength(20)
    password: string
}
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator"

export class SignUpDto {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    password: string

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    passwordConfirm: string

    @IsNotEmpty()
    firstName: string

    @IsNotEmpty()
    lastName: string

    address: string
    postalCode: string
}
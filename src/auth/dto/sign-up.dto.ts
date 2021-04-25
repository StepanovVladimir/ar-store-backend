import { IsEmail, IsNotEmpty, IsOptional, IsPostalCode, MaxLength, MinLength } from "class-validator"

export class SignUpDto {
    @IsEmail()
    email: string

    @MinLength(6)
    @MaxLength(20)
    password: string

    @MinLength(6)
    @MaxLength(20)
    passwordConfirm: string

    @IsNotEmpty()
    firstName: string

    @IsNotEmpty()
    lastName: string

    address: string

    @IsPostalCode('RU')
    @IsOptional()
    postalCode: string
}
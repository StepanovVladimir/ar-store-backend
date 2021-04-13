import { IsNotEmpty, MaxLength, MinLength } from "class-validator"

export class ChangePasswordDto {
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    oldPassword: string

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    password: string

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    passwordConfirm: string
}
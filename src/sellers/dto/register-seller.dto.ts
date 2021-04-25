import { IsEmail, IsNotEmpty } from "class-validator"

export class RegisterSellerDto {
    @IsEmail()
    email: string

    @IsNotEmpty()
    firstName: string

    @IsNotEmpty()
    lastName: string
}
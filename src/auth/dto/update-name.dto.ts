import { IsNotEmpty } from "class-validator"

export class UpdateNameDto {
    @IsNotEmpty()
    firstName: string

    @IsNotEmpty()
    lastName: string
}
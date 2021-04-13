import { IsNotEmpty, IsPostalCode } from "class-validator"

export class UpdateAddressDto {
    @IsNotEmpty()
    address: string

    @IsPostalCode('RU')
    postalCode: string
}
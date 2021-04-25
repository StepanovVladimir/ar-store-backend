import { IsNotEmpty, Min } from "class-validator"

export class QuantityDto {
    @IsNotEmpty()
    size: number

    @IsNotEmpty()
    colorId: number

    color?: string

    @IsNotEmpty()
    @Min(0)
    quantity: number
}
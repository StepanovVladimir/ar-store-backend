import { IsNotEmpty, IsPositive } from "class-validator"
import { QuantityDto } from "./quantity.dto"

export class QuantitiesDto {
    @IsNotEmpty()
    @IsPositive()
    price: number

    quantities: QuantityDto[]
}
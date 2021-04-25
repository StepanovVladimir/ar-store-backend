import { IsNotEmpty, IsPositive } from "class-validator"
import { QuantityDto } from "./quantity.dto"

export class PartialUpdateProductDto {
    @IsNotEmpty()
    @IsPositive()
    price: number

    quantities: QuantityDto[]
}
import { IsNotEmpty, IsPositive } from "class-validator";

export class UpdateProductPriceDto {
    @IsNotEmpty()
    @IsPositive()
    price: number
}
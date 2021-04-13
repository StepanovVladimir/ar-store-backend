import { IsNotEmpty, IsPositive, Max, Min } from "class-validator";

export class AddProductQuantityDto {
    @IsNotEmpty()
    @Min(15)
    @Max(50)
    size: number

    @IsNotEmpty()
    @IsPositive()
    quantity: number
}
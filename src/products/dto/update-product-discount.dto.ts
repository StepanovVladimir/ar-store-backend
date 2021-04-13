import { IsNotEmpty, Max, Min } from "class-validator";

export class UpdateProductDiscountDto {
    @IsNotEmpty()
    @Min(0)
    @Max(100)
    discount: number
}
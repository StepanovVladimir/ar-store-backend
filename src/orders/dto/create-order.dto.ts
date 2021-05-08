import { IsCreditCard, IsNotEmpty, Max, Min } from "class-validator";

export class CreateOrderDto {
    /*@IsCreditCard()
    cardNumber: string

    @Min(1)
    @Max(12)
    expirationMonth: number

    @IsNotEmpty()
    expirationYear: number

    @IsNotEmpty()
    ownerName: string*/

    @IsNotEmpty()
    productId: number

    @IsNotEmpty()
    colorId: number

    @IsNotEmpty()
    size: number    
}
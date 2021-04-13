import { IsNotEmpty } from "class-validator"

export class AddToCartDto {
    @IsNotEmpty()
    productId: number

    @IsNotEmpty()
    size: number
}
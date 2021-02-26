import { IsIn, IsNotEmpty, IsPositive, Max, Min } from "class-validator"
import { AVAILABLE_LANGS } from "src/constants/constants"

export class UpdateProductDto {
    @IsIn(AVAILABLE_LANGS)
    lang: string

    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    description: string

    image: string

    volumeModel: string

    @IsNotEmpty()
    @IsPositive()
    price: number

    @IsNotEmpty()
    @Min(0)
    @Max(100)
    discount: number
}
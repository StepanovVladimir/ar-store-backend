import { IsIn, IsNotEmpty, IsPositive, Max, Min } from "class-validator"
import { AVAILABLE_LANGS } from "src/config/constants"

export class CreateProductDto {
    @IsIn(AVAILABLE_LANGS)
    lang: string

    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    description: string

    @IsNotEmpty()
    image: string

    @IsNotEmpty()
    volumeModel: string

    @IsNotEmpty()
    @IsPositive()
    price: number

/*    @IsNotEmpty()
    @Min(0)
    @Max(100)
    discount: number*/

    sizes: number[]

    categoryIds: number[]
}
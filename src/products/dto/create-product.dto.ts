import { IsNotEmpty, IsPositive } from "class-validator"
import { ColorDto } from "./color.dto"

export class CreateProductDto {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    description: string

    @IsNotEmpty()
    brandId: number

    @IsNotEmpty()
    typeId: number

    @IsNotEmpty()
    genderId: number

    @IsNotEmpty()
    seasonId: number

    @IsNotEmpty()
    image: string

    @IsNotEmpty()
    volumeModel: string

    @IsNotEmpty()
    liningMaterial: string

    @IsNotEmpty()
    soleMaterial: string

    @IsNotEmpty()
    insoleMaterial: string

    @IsNotEmpty()
    @IsPositive()
    price: number

/*    @IsNotEmpty()
    @Min(0)
    @Max(100)
    discount: number*/

    sizes: number[]

    colors: ColorDto[]
}
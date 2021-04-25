import { ColorDto } from "./color.dto"

export class ProductDto {
    id: number
    name: string
    description?: string
    brandId?: number
    brand: string
    typeId?: number
    type?: string
    genderId?: number
    gender?: string
    seasonId?: number
    season?: string
    image: string
    volumeModel?: string
    price: number
    sizes?: number[]
    colors?: ColorDto[]
}
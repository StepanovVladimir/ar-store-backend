import { EstimationDto } from "src/orders/dto/estimation.dto"
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
    averageEstimation?: number
    sizes?: number[]
    colors?: ColorDto[]
    estimations?: EstimationDto[]
}
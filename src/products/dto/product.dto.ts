import { ProductSizeDto } from "./product-size.dto"

export class ProductDto {
    id: number
    name: string
    description: string
    image: string
    volumeModel: string
    price: number
    discount: number
    sizes: ProductSizeDto[]
    categoryIds: number[]
}
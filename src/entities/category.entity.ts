import { CategoryInfo } from "./category-info.entity"
import { Product } from "./product.entity"

export class Category {
    id: number
    infos: CategoryInfo[]
    products: Product[]
}
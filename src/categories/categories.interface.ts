import { Category } from "src/entities/category.entity";

export abstract class CategoriesInterface {
    abstract getCategories(): Category[]
}
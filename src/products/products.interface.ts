import { ProductDto } from "src/products/dto/product.dto";
import { CreateProductDto } from "./dto/create-product.dto";
import { GetProductsFilterDto } from "./dto/get-products-filter.dto";

export abstract class ProductsInterface {
    abstract getProducts(filterDto: GetProductsFilterDto, lang: string): Promise<ProductDto[]>
    abstract getProduct(id: number, lang: string): Promise<ProductDto>
    abstract createProduct(createProductDto: CreateProductDto): Promise<{ id: number }>
    abstract updateProductPrice(id: number, price: number): Promise<void>
    abstract updateProductDiscount(id: number, discount: number): Promise<void>
    abstract deleteProduct(id: number): Promise<void>
}
import { ProductDto } from "src/products/dto/product.dto";
import { CreateProductDto } from "./dto/create-product.dto";
import { GetProductsFilterDto } from "./dto/get-products-filter.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

export abstract class ProductsInterface {
    abstract getProducts(filterDto: GetProductsFilterDto, lang: string): Promise<ProductDto[]>
    abstract getProduct(id: number, lang: string): Promise<ProductDto>
    abstract createProduct(createProductDto: CreateProductDto): Promise<{ id: number }>
    abstract updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<void>
    abstract updateProductPrice(id: number, price: number): Promise<void>
    abstract updateProductDiscount(id: number, discount: number): Promise<void>
    abstract unavailableProduct(id: number): Promise<void>
    abstract availableProduct(id: number): Promise<void>
}
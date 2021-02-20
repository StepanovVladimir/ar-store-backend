import { Body, Controller, Delete, Get, Headers, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductsInterface } from 'src/products/products.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { ProductDto } from './dto/product.dto';
import { ProductDiscountValidationPipe } from './pipes/product-discount-validation.pipe';
import { ProductPriceValidationPipe } from './pipes/product-price-validation.pipe';

@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsInterface) {}

    @Get()
    getProducts(
        @Query(ValidationPipe) filterDto: GetProductsFilterDto,
        @Headers('Accept-Language') lang: string
    ): Promise<ProductDto[]> {
        return this.productsService.getProducts(filterDto, lang.substr(0, 2))
    }

    @Get('/:id')
    getProduct(
        @Param('id', ParseIntPipe) id: number,
        @Headers('Accept-Language') lang: string
    ): Promise<ProductDto> {
        return this.productsService.getProduct(id, lang.substr(0, 2))
    }

    @Post()
    @UseGuards(AuthGuard())
    @UsePipes(ValidationPipe)
    createProduct(@Body() createProductDto: CreateProductDto): Promise<{ id: number }> {
        return this.productsService.createProduct(createProductDto)
    }

    @Patch('/:id/price')
    updateProductPrice(
        @Param('id', ParseIntPipe) id: number,
        @Body('price', ProductPriceValidationPipe) price: number
    ): Promise<void> {
        return this.productsService.updateProductPrice(id, price)
    }

    @Patch('/:id/discount')
    updateProductDiscount(
        @Param('id', ParseIntPipe) id: number,
        @Body('discount', ProductDiscountValidationPipe) discount: number
    ): Promise<void> {
        return this.productsService.updateProductDiscount(id, discount)
    }

    @Delete('/:id')
    deleteProduct(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.productsService.deleteProduct(id)
    }
}

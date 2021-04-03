import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { PRODUCTS_MANAGING_PERMISSION } from 'src/config/constants';
import { GetLang } from 'src/common/decorators/get-lang.decorator';
import { HasPermission } from 'src/common/decorators/has-permission.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { ProductDto } from './dto/product.dto';
import { ProductDiscountValidationPipe } from './pipes/product-discount-validation.pipe';
import { ProductPriceValidationPipe } from './pipes/product-price-validation.pipe';
import { ProductSizesValidationPipe } from './pipes/product-sizes-validation.pipe';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) {}

    @Get()
    getProducts(
        @Query(ValidationPipe) filterDto: GetProductsFilterDto,
        @GetLang() lang: string
    ): Promise<ProductDto[]> {
        return this.productsService.getProducts(filterDto, lang)
    }

    @Get('/:id')
    getProduct(
        @Param('id', ParseIntPipe) id: number,
        @GetLang() lang: string
    ): Promise<ProductDto> {
        return this.productsService.getProduct(id, lang)
    }

    @Post()
    @HasPermission(PRODUCTS_MANAGING_PERMISSION)
    @UseGuards(AuthGuard(), PermissionGuard)
    createProduct(@Body(ValidationPipe, ProductSizesValidationPipe) createProductDto: CreateProductDto): Promise<{ id: number }> {
        return this.productsService.createProduct(createProductDto)
    }

    @Put('/:id')
    @HasPermission(PRODUCTS_MANAGING_PERMISSION)
    @UseGuards(AuthGuard(), PermissionGuard)
    updateProduct(
        @Param('id', ParseIntPipe) id: number,
        @Body(ValidationPipe, ProductSizesValidationPipe) createProductDto: CreateProductDto
    ): Promise<{ id: number }> {
        return this.productsService.updateProduct(id, createProductDto)
    }

    @Patch('/:id/price')
    @HasPermission(PRODUCTS_MANAGING_PERMISSION)
    @UseGuards(AuthGuard(), PermissionGuard)
    updateProductPrice(
        @Param('id', ParseIntPipe) id: number,
        @Body('price', ProductPriceValidationPipe) price: number
    ): Promise<{ id: number }> {
        return this.productsService.updateProductPrice(id, price)
    }

    @Patch('/:id/discount')
    @HasPermission(PRODUCTS_MANAGING_PERMISSION)
    @UseGuards(AuthGuard(), PermissionGuard)
    updateProductDiscount(
        @Param('id', ParseIntPipe) id: number,
        @Body('discount', ProductDiscountValidationPipe) discount: number
    ): Promise<{ id: number }> {
        return this.productsService.updateProductDiscount(id, discount)
    }
}

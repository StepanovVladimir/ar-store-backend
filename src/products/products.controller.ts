import { Body, Controller, Get, Headers, Param, ParseIntPipe, Patch, Post, Put, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from 'src/auth/permission.guard';
import { PRODUCTS_MANAGING_PERMISSION } from 'src/constants/constants';
import { GetLang } from 'src/decorators/get-lang.decorator';
import { HasPermission } from 'src/decorators/has-permission.decorator';
import { ProductsInterface } from 'src/products/products.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { ProductDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDiscountValidationPipe } from './pipes/product-discount-validation.pipe';
import { ProductPriceValidationPipe } from './pipes/product-price-validation.pipe';

@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsInterface) {}

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
    createProduct(@Body(ValidationPipe) createProductDto: CreateProductDto): Promise<{ id: number }> {
        return this.productsService.createProduct(createProductDto)
    }

    @Put('/:id')
    @HasPermission(PRODUCTS_MANAGING_PERMISSION)
    @UseGuards(AuthGuard(), PermissionGuard)
    updateProduct(
        @Param('id', ParseIntPipe) id: number,
        @Body(ValidationPipe) updateProductDto: UpdateProductDto
    ): Promise<void> {
        return this.productsService.updateProduct(id, updateProductDto)
    }

    @Patch('/:id/price')
    @HasPermission(PRODUCTS_MANAGING_PERMISSION)
    @UseGuards(AuthGuard(), PermissionGuard)
    updateProductPrice(
        @Param('id', ParseIntPipe) id: number,
        @Body('price', ProductPriceValidationPipe) price: number
    ): Promise<void> {
        return this.productsService.updateProductPrice(id, price)
    }

    @Patch('/:id/discount')
    @HasPermission(PRODUCTS_MANAGING_PERMISSION)
    @UseGuards(AuthGuard(), PermissionGuard)
    updateProductDiscount(
        @Param('id', ParseIntPipe) id: number,
        @Body('discount', ProductDiscountValidationPipe) discount: number
    ): Promise<void> {
        return this.productsService.updateProductDiscount(id, discount)
    }

    @Patch('/:id/unavailable')
    @HasPermission(PRODUCTS_MANAGING_PERMISSION)
    @UseGuards(AuthGuard(), PermissionGuard)
    unavailableProduct(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.productsService.unavailableProduct(id)
    }

    @Patch('/:id/unavailable')
    @HasPermission(PRODUCTS_MANAGING_PERMISSION)
    @UseGuards(AuthGuard(), PermissionGuard)
    availableProduct(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.productsService.availableProduct(id)
    }
}

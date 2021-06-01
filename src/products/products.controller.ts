import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { ProductDto } from './dto/product.dto';
import { ProductsService } from './products.service';
import { HasRoles } from 'src/common/decorators/has-roles.decorator';
import { ADMIN_ROLE } from 'src/config/constants';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ProductSizesValidationPipe } from './pipes/product-sizes-validation.pipe';
import { ProductQuantitiesValidationPipe } from './pipes/product-quantities-validation.pipe';
import { ProductsDto } from './dto/products.dto';
import { QuantitiesDto } from './dto/quantities.dto';

@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) {}

    @Get()
    getProducts(
        @Query() filterDto: GetProductsFilterDto
    ): Promise<ProductsDto> {
        return this.productsService.getProducts(filterDto)
    }

    @Get('/:id')
    getProduct(@Param('id', ParseIntPipe) id: number): Promise<ProductDto> {
        return this.productsService.getProduct(id)
    }

    @Get('/:id/quantities')
    getQuantities(@Param('id', ParseIntPipe) id: number): Promise<QuantitiesDto> {
        return this.productsService.getQuantities(id)
    }

    @Post()
    @HasRoles(ADMIN_ROLE)
    @UseGuards(AuthGuard(), RolesGuard)
    createProduct(
        @Body(ValidationPipe, ProductSizesValidationPipe) createProductDto: CreateProductDto
    ): Promise<{ id: number }> {
        return this.productsService.createProduct(createProductDto)
    }

    @Put('/:id')
    @HasRoles(ADMIN_ROLE)
    @UseGuards(AuthGuard(), RolesGuard)
    updateProduct(
        @Param('id', ParseIntPipe) id: number,
        @Body(ValidationPipe, ProductSizesValidationPipe) updateProductDto: CreateProductDto
    ): Promise<{ id: number }> {
        return this.productsService.updateProduct(id, updateProductDto)
    }

    @Put('/:id/partial')
    @HasRoles(ADMIN_ROLE)
    @UseGuards(AuthGuard(), RolesGuard)
    partialUpdateProduct(
        @Param('id', ParseIntPipe) id: number,
        @Body(ValidationPipe, ProductQuantitiesValidationPipe) updateProductDto: QuantitiesDto
    ): Promise<{ id: number }> {
        return this.productsService.partialUpdateProductDto(id, updateProductDto)
    }

    @Delete('/:id')
    @HasRoles(ADMIN_ROLE)
    @UseGuards(AuthGuard(), RolesGuard)
    deleteProduct(@Param('id', ParseIntPipe) id: number): Promise<{ id: number }> {
        return this.productsService.deleteProduct(id)
    }
}

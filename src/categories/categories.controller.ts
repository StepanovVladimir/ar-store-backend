import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetLang } from 'src/common/decorators/get-lang.decorator';
import { HasPermission } from 'src/common/decorators/has-permission.decorator';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { PRODUCTS_MANAGING_PERMISSION } from 'src/config/constants';
import { CategoriesService } from './categories.service';
import { CategoryDto } from './dto/category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
    constructor(private categoriesService: CategoriesService) {}

    @Get()
    getCategories(@GetLang() lang: string): Promise<CategoryDto[]> {
        return this.categoriesService.getCategories(lang)
    }

    @Post()
    @HasPermission(PRODUCTS_MANAGING_PERMISSION)
    @UseGuards(AuthGuard(), PermissionGuard)
    createCategory(@Body(ValidationPipe) createCategoryDto: CreateCategoryDto): Promise<{ id: number }> {
        return this.categoriesService.createCategory(createCategoryDto)
    }

    @Put('/:id')
    @HasPermission(PRODUCTS_MANAGING_PERMISSION)
    @UseGuards(AuthGuard(), PermissionGuard)
    updateCategory(
        @Param('id', ParseIntPipe) id: number,
        @Body(ValidationPipe) createCategoryDto: CreateCategoryDto
    ): Promise<{ id: number }> {
        return this.categoriesService.updateCategory(id, createCategoryDto)
    }

    @Delete('/:id')
    @HasPermission(PRODUCTS_MANAGING_PERMISSION)
    @UseGuards(AuthGuard(), PermissionGuard)
    deleteCategory(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
        return this.categoriesService.deleteCategory(id)
    }
}

import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesDto } from './dto/categories.dto';

@Controller('categories')
export class CategoriesController {
    constructor(private categoriesService: CategoriesService) {}

    @Get()
    getCategories(): Promise<CategoriesDto> {
        return this.categoriesService.getCategories()
    }
}

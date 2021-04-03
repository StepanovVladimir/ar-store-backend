import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryInfo } from 'src/common/entities/category-info.entity';
import { Category } from 'src/common/entities/category.entity';
import { CategoryInfoRepository } from 'src/common/repositories/category-info.repository';
import { CategoryRepository } from 'src/common/repositories/category.repository';
import { CategoryDto } from './dto/category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(CategoryRepository)
        private categoryRepository: CategoryRepository,

        @InjectRepository(CategoryInfoRepository)
        private categoryInfoRepository: CategoryInfoRepository,
    ) {}
    
    async getCategories(lang: string): Promise<CategoryDto[]> {
        const categories = await this.categoryRepository.find({ relations: ['infos'] })
        return categories.map(category => {
            let info = category.infos.find(info => info.lang === lang)
            if (!info) {
                info = category.infos.find(info => info.lang === 'ru')
                if (!info) {
                    info = category.infos[0]
                }
            }

            return {
                id: category.id,
                name: info.name
            }
        })
    }

    async createCategory(createCategoryDto: CreateCategoryDto): Promise<{ id: number }> {
        const category = new Category()
        await category.save()

        const categoryInfo = new CategoryInfo()
        categoryInfo.categoryId = category.id
        categoryInfo.lang = createCategoryDto.lang
        categoryInfo.name = createCategoryDto.name
        await categoryInfo.save()

        return { id: category.id }
    }

    async updateCategory(id: number, createCategoryDto: CreateCategoryDto): Promise<{ id: number }> {
        const category = await this.categoryRepository.findOne(id)
        if (!category) {
            throw new NotFoundException('There is no category with this id')
        }

        let categoryInfo = await this.categoryInfoRepository.findOne({ categoryId: id, lang: createCategoryDto.lang })
        if (!categoryInfo) {
            categoryInfo = new CategoryInfo()
            categoryInfo.categoryId = id
            categoryInfo.lang = createCategoryDto.lang
        }

        categoryInfo.name = createCategoryDto.name
        await categoryInfo.save()

        return { id }
    }
}

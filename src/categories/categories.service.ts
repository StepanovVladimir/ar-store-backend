import { Injectable } from '@nestjs/common';
import { CategoryInfo } from 'src/entities/category-info.entity';
import { Category } from 'src/entities/category.entity';
import { CategoriesInterface } from 'src/categories/categories.interface';

@Injectable()
export class CategoriesService implements CategoriesInterface {
    private categories: Category[] = [
        { id: 1, infos: [], products: [] },
        { id: 2, infos: [], products: [] },
        { id: 3, infos: [], products: [] },
        { id: 4, infos: [], products: [] }
    ]
    private id: number = 5
    private categoryInfos: CategoryInfo[] = [
        { categoryId: 1, lang: 'en', name: 'shirt' },
        { categoryId: 2, lang: 'en', name: 'shoes' },
        { categoryId: 3, lang: 'en', name: 'adidas' },
        { categoryId: 4, lang: 'en', name: 'sneakers' }
    ]

    getCategories(): Category[] {
        return this.categories
    }
}

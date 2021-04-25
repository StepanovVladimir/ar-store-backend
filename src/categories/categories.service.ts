import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandRepository } from 'src/common/repositories/brand.repository';
import { ColorRepository } from 'src/common/repositories/color.repository';
import { GenderRepository } from 'src/common/repositories/gender.repository';
import { SeasonRepository } from 'src/common/repositories/season.repository';
import { ShoeTypeRepository } from 'src/common/repositories/shoe-type.repository';
import { CategoriesDto } from './dto/categories.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(BrandRepository)
        private brandRepository: BrandRepository,

        @InjectRepository(ColorRepository)
        private colorRepository: ColorRepository,

        @InjectRepository(GenderRepository)
        private genderRepository: GenderRepository,

        @InjectRepository(SeasonRepository)
        private seasonRepository: SeasonRepository,

        @InjectRepository(ShoeTypeRepository)
        private shoeTypeRepository: ShoeTypeRepository
    ) {}

    async getCategories(): Promise<CategoriesDto> {
        return {
            brands: await this.brandRepository.find({ order: { id: 'ASC' } }),
            colors: await this.colorRepository.find({ order: { id: 'ASC' } }),
            genders: await this.genderRepository.find({ order: { id: 'ASC' } }),
            seasons: await this.seasonRepository.find({ order: { id: 'ASC' } }),
            shoeTypes: await this.shoeTypeRepository.find({ order: { id: 'ASC' } }),
        }
    }
}

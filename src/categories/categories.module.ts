import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { BrandRepository } from 'src/common/repositories/brand.repository';
import { ColorRepository } from 'src/common/repositories/color.repository';
import { GenderRepository } from 'src/common/repositories/gender.repository';
import { SeasonRepository } from 'src/common/repositories/season.repository';
import { ShoeTypeRepository } from 'src/common/repositories/shoe-type.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([BrandRepository, ColorRepository, GenderRepository, SeasonRepository, ShoeTypeRepository]),
    AuthModule
  ],
  providers: [CategoriesService],
  controllers: [CategoriesController]
})
export class CategoriesModule {}

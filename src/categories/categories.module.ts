import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryRepository } from 'src/common/repositories/category.repository';
import { CategoryInfoRepository } from 'src/common/repositories/category-info.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryRepository, CategoryInfoRepository]),
    AuthModule
  ],
  providers: [CategoriesService],
  controllers: [CategoriesController]
})
export class CategoriesModule {}

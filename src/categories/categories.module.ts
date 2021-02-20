import { Module } from '@nestjs/common';
import { CategoriesInterface } from 'src/categories/categories.interface';
import { CategoriesService } from './categories.service';

@Module({
  providers: [{ provide: CategoriesInterface, useClass: CategoriesService }]
})
export class CategoriesModule {}

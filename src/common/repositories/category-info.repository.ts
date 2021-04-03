import { EntityRepository, Repository } from "typeorm";
import { CategoryInfo } from "../entities/category-info.entity";

@EntityRepository(CategoryInfo)
export class CategoryInfoRepository extends Repository<CategoryInfo> {}
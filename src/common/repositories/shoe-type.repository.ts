import { EntityRepository, Repository } from "typeorm";
import { ShoeType } from "../entities/shoe-type.entity";

@EntityRepository(ShoeType)
export class ShoeTypeRepository extends Repository<ShoeType> {}
import { EntityRepository, Repository } from "typeorm";
import { Color } from "../entities/color.entity";

@EntityRepository(Color)
export class ColorRepository extends Repository<Color> {}
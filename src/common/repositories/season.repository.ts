import { EntityRepository, Repository } from "typeorm";
import { Season } from "../entities/season.entity";

@EntityRepository(Season)
export class SeasonRepository extends Repository<Season> {}
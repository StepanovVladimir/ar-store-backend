import { User } from "src/entities/user.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(User)
export class UsersRepository extends Repository<User> {}
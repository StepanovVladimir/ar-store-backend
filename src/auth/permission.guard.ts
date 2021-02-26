import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { ROLE_PERMISSIONS } from "src/constants/constants";
import { UsersRepository } from "src/repositories/users.repository";

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        @InjectRepository(UsersRepository)
        private usersRepository: UsersRepository,
        private reflector: Reflector
    ) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const permission = this.reflector.get<string>('permission', ctx.getHandler())

        if (!permission) {
            return true
        }

        const email = ctx.switchToHttp().getRequest().user.email
        const user = await this.usersRepository.findOne({ email }, { relations: ["role"] })

        return user && ROLE_PERMISSIONS[user.role.name].includes(permission)
    }
}
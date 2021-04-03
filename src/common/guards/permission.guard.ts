import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLE_PERMISSIONS } from "src/config/constants";

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private reflector: Reflector
    ) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const permission = this.reflector.get<string>('permission', ctx.getHandler())

        if (!permission) {
            return true
        }

        const user = ctx.switchToHttp().getRequest().user

        return ROLE_PERMISSIONS[user.role.name].includes(permission)
    }
}
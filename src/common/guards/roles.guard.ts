import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector
    ) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<string[]>('roles', ctx.getHandler())

        if (!roles) {
            return true
        }

        const user = ctx.switchToHttp().getRequest().user

        return roles.includes(user.role.name)
    }
}
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { InjectRepository } from "@nestjs/typeorm"
import { Strategy, ExtractJwt } from "passport-jwt"
import { User } from "src/entities/user.entity"
import { UsersRepository } from "src/repositories/users.repository"
import { JwtPayload } from "./jwt-payload"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UsersRepository)
        private usersRepository: UsersRepository
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'qwerty1234567890'
        })
    }

    async validate(payload: JwtPayload): Promise<User> {
        const user = await this.usersRepository.findOne({ email: payload.email })

        if (!user) {
            throw new UnauthorizedException()
        }

        return user
    }
}
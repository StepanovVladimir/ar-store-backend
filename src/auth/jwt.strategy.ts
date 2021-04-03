import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { InjectRepository } from "@nestjs/typeorm"
import { Strategy, ExtractJwt } from "passport-jwt"
import { User } from "src/common/entities/user.entity"
import { UserRepository } from "src/common/repositories/user.repository"
import { JwtPayload } from "./jwt-payload"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        })
    }

    async validate(payload: JwtPayload): Promise<User> {
        return await this.userRepository.findOne(payload.id, { relations: ['role'] })
    }
}
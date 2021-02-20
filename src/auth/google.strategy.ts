/*import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20"
import { User } from "src/entities/user.entity";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: '190233674601-6kbc2k1gvald9pt0vkmf54g7qll877gt.apps.googleusercontent.com',
            clientSecret: 'nL7fO_oDg3qhyWq7AjPIHT1M',
            callbackURL: 'http://localhost:3000/auth/google/callback',
            scope: ['email', 'profile']
        })
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { name, emails } = profile
        const user: User = new User()
        user.email = emails[0].value
        user.firstName = name.givenName
        user.lastName = name.familyName
        user.passwordHash = accessToken

        done(null, user);
    }
}*/
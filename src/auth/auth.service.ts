import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UsersRepository } from 'src/repositories/users.repository';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt-payload';
import { JwtService } from '@nestjs/jwt';
import { AuthInterface } from './auth.interface';
import { SignInDto } from './dto/sign-in.dto';
import { ROLE_PERMISSIONS } from 'src/constants/constants';

@Injectable()
export class AuthService implements AuthInterface {
    constructor(
        @InjectRepository(UsersRepository)
        private usersRepository: UsersRepository,
        private jwtService: JwtService
    ) {}

    async signUp(signUpDto: SignUpDto): Promise<void> {
        const user = new User();
        user.email = signUpDto.email.toLowerCase()
        user.salt = await bcrypt.genSalt()
        user.passwordHash = await bcrypt.hash(signUpDto.password, user.salt)
        user.firstName = signUpDto.firstName
        user.lastName = signUpDto.lastName
        user.address = signUpDto.address
        user.roleId = 1

        try {
            await user.save()
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException()
            } else {
                throw new InternalServerErrorException()
            }
        }
    }

    async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
        const user = await this.usersRepository.findOne({ email: signInDto.email.toLowerCase() }, { relations: ["role"] })

        if (!user || !await user.validatePassword(signInDto.password)) {
            throw new UnauthorizedException()
        }

        const payload: JwtPayload = {
            email: user.email,
            permissions: ROLE_PERMISSIONS[user.role.name]
        }

        const accessToken = await this.jwtService.sign(payload)

        return { accessToken }
    }
}

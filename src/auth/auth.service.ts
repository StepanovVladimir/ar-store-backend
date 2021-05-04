import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/common/repositories/user.repository';
import { User } from 'src/common/entities/user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt-payload';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { AuthResultDto } from './dto/auth-result.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { USER_ROLE_ID } from 'src/config/constants';
import { sendEmail } from 'src/common/utils/sendEmail';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private usersRepository: UserRepository,
        private jwtService: JwtService
    ) {}

    async signUp(signUpDto: SignUpDto): Promise<{ id: number }> {
        const user = new User();
        user.email = signUpDto.email.toLowerCase()
        user.salt = await bcrypt.genSalt()
        user.passwordHash = await bcrypt.hash(signUpDto.password, user.salt)
        user.firstName = signUpDto.firstName
        user.lastName = signUpDto.lastName
        user.confirmed = false
        user.address = signUpDto.address
        user.postalCode = signUpDto.postalCode
        user.roleId = USER_ROLE_ID

        try {
            await user.save()
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('There is already a user with this email address', 'EmailAlreadyExists')
            } else {
                throw error
            }
        }

        const payload: JwtPayload = {
            id: user.id
        }

        const accessToken = await this.jwtService.sign(payload)
        const url = `${process.env.HOST}/auth/confirmation/${accessToken}`

        await sendEmail(user.email, url)

        return { id: user.id }
    }

    async signIn(signInDto: SignInDto): Promise<AuthResultDto> {
        const user = await this.usersRepository.findOne({ email: signInDto.email.toLowerCase() }, { relations: ["role"] })

        if (!user || !await this.validatePassword(user, signInDto.password)) {
            throw new UnauthorizedException()
        }

        if (!user.confirmed) {
            throw new UnauthorizedException('Email not confirmed', 'EmailNotConfirmed')
        }

        const payload: JwtPayload = {
            id: user.id
        }

        const accessToken = await this.jwtService.sign(payload)

        return {
            accessToken,
            id: user.id,
            role: user.role.name
        }
    }

    async confirmEmail(token: string): Promise<string> {
        const payload: JwtPayload = this.jwtService.verify<JwtPayload>(token)

        const user = await this.usersRepository.findOne(payload.id)

        user.confirmed = true

        await user.save()

        return 'Email successfully confirmed'
    }

    async resubmitConfirmMessage(signInDto: SignInDto): Promise<{ id: number }> {
        const user = await this.usersRepository.findOne({ email: signInDto.email.toLowerCase() })

        if (!user || !await this.validatePassword(user, signInDto.password)) {
            throw new UnauthorizedException()
        }

        if (user.confirmed) {
            throw new BadRequestException('Email already confirmed', 'EmailAlreadyConfirmed')
        }

        const payload: JwtPayload = {
            id: user.id
        }

        const accessToken = await this.jwtService.sign(payload)
        const url = `${process.env.HOST}/auth/confirmation/${accessToken}`

        await sendEmail(user.email, url)

        return { id: user.id }
    }

    async changePassword(user: User, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
        if (!await this.validatePassword(user, changePasswordDto.oldPassword)) {
            throw new BadRequestException('The old password is wrong', 'WrongPassword')
        }

        user.passwordHash = await bcrypt.hash(changePasswordDto.password, user.salt)

        await user.save()

        return { message: 'Changed' }
    }

    async updateAddress(user: User, updateAddressDto: UpdateAddressDto): Promise<{ message: string }> {
        user.address = updateAddressDto.address
        user.postalCode = updateAddressDto.postalCode
        await user.save()

        return { message: 'Updated' }
    }

    private async validatePassword(user: User, password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, user.salt)
        return hash === user.passwordHash
    }
}

import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/common/repositories/user.repository';
import { User } from 'src/common/entities/user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt-payload';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { ROLE_PERMISSIONS } from 'src/config/constants';
import { AuthResultDto } from './dto/auth-result.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

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
        user.address = signUpDto.address
        user.roleId = 1

        try {
            await user.save()
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('There is already a user with this email address', 'EmailAlreadyExists')
            } else {
                throw error
            }
        }

        return { id: user.id }
    }

    async signIn(signInDto: SignInDto): Promise<AuthResultDto> {
        const user = await this.usersRepository.findOne({ email: signInDto.email.toLowerCase() }, { relations: ["role"] })

        if (!user || !await this.validatePassword(user, signInDto.password)) {
            throw new UnauthorizedException()
        }

        const payload: JwtPayload = {
            id: user.id
        }

        const accessToken = await this.jwtService.sign(payload)

        return {
            accessToken,
            id: user.id,
            role: user.role.name,
            permissions: ROLE_PERMISSIONS[user.role.name]
        }
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

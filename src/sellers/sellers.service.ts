import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/entities/user.entity';
import { UserRepository } from 'src/common/repositories/user.repository';
import { RegisterSellerDto } from './dto/register-seller.dto';
import * as bcrypt from 'bcrypt';
import { SELLER_ROLE_ID } from 'src/config/constants';

@Injectable()
export class SellersService {
    private readonly DEFAULT_PASSWORD = 'qwerty1';

    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {}

    async getSellers(): Promise<User[]> {
        return this.userRepository.find({
            select: ['id', 'email', 'firstName', 'lastName'],
            where: { roleId: SELLER_ROLE_ID },
            order: { firstName: 'ASC', lastName: 'ASC' }
        })
    }

    async registerSeller(registerSellerDto: RegisterSellerDto): Promise<{ id: number }> {
        const user = new User();
        user.email = registerSellerDto.email.toLowerCase()
        user.salt = await bcrypt.genSalt()
        user.passwordHash = await bcrypt.hash(this.DEFAULT_PASSWORD, user.salt)
        user.firstName = registerSellerDto.firstName
        user.lastName = registerSellerDto.lastName
        user.roleId = SELLER_ROLE_ID

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

    async deleteSeller(id: number): Promise<{ message: string }> {
        const seller = await this.userRepository.findOne(id)
        if (!seller || seller.roleId != SELLER_ROLE_ID) {
            throw new NotFoundException('There is no seller with this id', 'SellerNotFound')
        }

        await seller.remove()

        return { message: 'Deleted' }
    }
}

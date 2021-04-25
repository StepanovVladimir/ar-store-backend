import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HasRoles } from 'src/common/decorators/has-roles.decorator';
import { User } from 'src/common/entities/user.entity';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ADMIN_ROLE } from 'src/config/constants';
import { RegisterSellerDto } from './dto/register-seller.dto';
import { SellersService } from './sellers.service';

@Controller('sellers')
@HasRoles(ADMIN_ROLE)
@UseGuards(AuthGuard(), RolesGuard)
export class SellersController {
    constructor(private sellersService: SellersService) {}

    @Get()
    getSellers(): Promise<User[]> {
        return this.sellersService.getSellers()
    }

    @Post()
    registerSeller(@Body(ValidationPipe) registerSellerDto: RegisterSellerDto): Promise<{ id: number }> {
        return this.sellersService.registerSeller(registerSellerDto)
    }

    @Delete('/:id')
    deleteSeller(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
        return this.sellersService.deleteSeller(id)
    }
}

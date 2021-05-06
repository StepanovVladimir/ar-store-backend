import { Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/common/entities/user.entity';
import { ProductDto } from 'src/products/dto/product.dto';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
@UseGuards(AuthGuard())
export class FavoritesController {
    constructor(private favoritesService: FavoritesService) {}

    @Get()
    getFavorites(@GetUser() user: User): Promise<ProductDto[]> {
        return this.favoritesService.getFavorites(user)
    }

    @Post('/:productId')
    addToFavorites(@GetUser() user: User, @Param('productId', ParseIntPipe) productId: number): Promise<{ message: string }> {
        return this.favoritesService.addToFavorites(user, productId)
    }

    @Delete('/:productId')
    deleteFromFavorites(@GetUser() user: User, @Param('productId', ParseIntPipe) productId: number): Promise<{ message: string }> {
        return this.favoritesService.deleteFromFavorites(user, productId)
    }
}

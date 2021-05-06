import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from 'src/common/entities/favorite.entity';
import { User } from 'src/common/entities/user.entity';
import { FavoriteRepository } from 'src/common/repositories/favorite.repository';
import { ProductDto } from 'src/products/dto/product.dto';

@Injectable()
export class FavoritesService {
    constructor(
        @InjectRepository(FavoriteRepository)
        private favoriteRepository: FavoriteRepository
    ) {}

    async getFavorites(user: User): Promise<ProductDto[]> {
        const query = this.favoriteRepository.createQueryBuilder('favorite')
        query.select('favorite.productId')
        query.addSelect('product.name')
        query.addSelect('brand.name')
        query.addSelect('product.image')
        query.addSelect('product.price')

        query.innerJoin('favorite.product', 'product')
        query.innerJoin('product.brand', 'brand')

        const favorites = await query.getMany()

        return favorites.map(favorite => ({
            id: favorite.productId,
            name: favorite.product.name,
            brand: favorite.product.brand.name,
            image: favorite.product.image,
            price: favorite.product.price
        }))
    }

    async addToFavorites(user: User, productId: number): Promise<{ message: string }> {
        const favorite = new Favorite()

        favorite.userId = user.id
        favorite.productId = productId

        try {
            await favorite.save()
        } catch (error) {
            if (error.code === '23503') {
                throw new NotFoundException('There is no product with this id', 'ProductNotFound')
            } else {
                throw error
            }
        }

        return { message: 'Added' }
    }

    async deleteFromFavorites(user: User, productId: number): Promise<{ message: string }> {
        const favorite = await this.favoriteRepository.findOne({ userId: user.id, productId })

        if (!favorite) {
            throw new BadRequestException('the product with this id is not in favorites', 'FavoriteNotFound')
        }

        await favorite.remove()

        return { message: 'Deleted' }
    }
}

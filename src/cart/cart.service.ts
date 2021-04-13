import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from 'src/common/entities/cart-item.entity';
import { User } from 'src/common/entities/user.entity';
import { CartItemRepository } from 'src/common/repositories/cart-item.repository';
import { ProductSizeRepository } from 'src/common/repositories/product-size.repository';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CartItemDto } from './dto/cart-item.dto';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(CartItemRepository)
        private cartItemRepository: CartItemRepository,

        @InjectRepository(ProductSizeRepository)
        private productSizeRepository: ProductSizeRepository
    ) {}

    async getCartItems(user: User, lang: string): Promise<CartItemDto[]> {
        const query = this.cartItemRepository.createQueryBuilder('item')
        query.select('item.productId')
        query.addSelect('item.size')
        query.addSelect('item.quantity')
        query.addSelect('product.image')
        query.addSelect('product.price')
        query.addSelect('product.discount')
        query.addSelect('info.name')

        query.where('item.userId = :userId', { userId: user.id })

        query.innerJoin('item.product', 'product')
        query.innerJoin('product.infos', 'info')

        const items = await query.getMany()

        return items.map(item => {
            let info = item.product.infos.find(info => info.lang === lang)
            if (!info) {
                info = item.product.infos.find(info => info.lang === 'ru')
                if (!info) {
                    info = item.product.infos[0]
                }
            }

            return {
                productId: item.productId,
                name: info.name,
                image: item.product.image,
                price: item.product.price,
                //discount: item.product.discount,
                size: item.size,
                quantity: item.quantity
            }
        })
    }

    async addToCart(user: User, addToCartDto: AddToCartDto): Promise<{ message: string }> {
        const productSize = await this.productSizeRepository.findOne({
            productId: addToCartDto.productId,
            size: addToCartDto.size
        })

        if (!productSize) {
            throw new NotFoundException('A product with this id doesn\'t have this size', 'ProductSizeNotFound')
        }

        const items = await this.cartItemRepository.find({ userId: user.id })
        let quantity = 0
        for (const item of items) {
            quantity += item.quantity
        }

        if (quantity >= 4) {
            throw new BadRequestException('The number of copies of the product in the cart can not be more than 4', 'TooManyQuantityInCart')
        }

        let item = await this.cartItemRepository.findOne({
            userId: user.id,
            productId: addToCartDto.productId,
            size: addToCartDto.size
        })

        if (!item) {
            if (productSize.quantity == 0) {
                throw new BadRequestException('At the moment there are no copies of the product of this size', 'NoProduct')
            }

            item = new CartItem()
            item.userId = user.id,
            item.productId = addToCartDto.productId,
            item.size = addToCartDto.size,
            item.quantity = 1
        } else {
            if (productSize.quantity <= item.quantity) {
                throw new BadRequestException('There are no more copies of the product of this size', 'NoMoreProduct')
            }

            item.quantity++
        }

        await item.save()

        return { message: 'Added' }
    }

    async deleteFromCart(user: User, deleteFromCartDto: AddToCartDto): Promise<{ message: string }> {
        let item = await this.cartItemRepository.findOne({
            userId: user.id,
            productId: deleteFromCartDto.productId,
            size: deleteFromCartDto.size
        })

        if (!item) {
            throw new NotFoundException('There is no product with this id and size in the cart', 'CartItemNotFound')
        }

        if (item.quantity > 1) {
            item.quantity--
            await item.save()
        } else {
            await item.remove()
        }

        return { message: 'Deleted' }
    }
}

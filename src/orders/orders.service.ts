import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from 'src/common/entities/order-item.entity';
import { Order } from 'src/common/entities/order.entity';
import { User } from 'src/common/entities/user.entity';
import { CartItemRepository } from 'src/common/repositories/cart-item.repository';
import { OrderRepository } from 'src/common/repositories/order.repository';
import { ProductSizeRepository } from 'src/common/repositories/product-size.repository';
import { PROCESSING_STATUS_ID } from 'src/config/constants';
import { OrderItemDto } from './dto/order-item.dto';
import { OrderDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(OrderRepository)
        private orderRepository: OrderRepository,

        @InjectRepository(CartItemRepository)
        private cartItemRepository: CartItemRepository,

        @InjectRepository(ProductSizeRepository)
        private productSizeRepository: ProductSizeRepository
    ) {}

    async getOrders(user: User): Promise<OrderDto[]> {
        const orders = await this.orderRepository.find({
            where: { userId: user.id },
            relations: ['user', 'status', 'items'],
            order: { time: 'DESC' }
        })

        return orders.map(order => {
            const dto = new OrderDto()
            dto.id = order.id
            dto.userId = order.userId
            dto.email = order.user.email
            dto.firstName = order.user.firstName
            dto.lastName = order.user.lastName
            dto.time = order.time
            dto.address = order.address
            dto.postalCode = order.postalCode
            dto.status = order.status.name
            dto.fullPrice = 0
            order.items.forEach(item =>
                dto.fullPrice += item.price * item.quantity
            )

            return dto
        })
    }

    /*async getOrder(id: number, user: User, lang: string): Promise<OrderDto> {
        const query = this.orderRepository.createQueryBuilder('order')
        query.select('order.id')
        query.addSelect('order.time')
        query.addSelect('order.address')
        query.addSelect('order.postalCode')
        query.addSelect('order.userId')
        query.addSelect('user.email')
        query.addSelect('user.firstName')
        query.addSelect('user.lastName')
        query.addSelect('status.name')
        query.addSelect('item.productId')
        query.addSelect('item.size')
        query.addSelect('item.price')
        query.addSelect('item.quantity')
        query.addSelect('product.price')
        query.addSelect('product.discount')
        query.addSelect('info.name')

        query.where('order.id = :id', { id })
        query.andWhere('order.userId = :userId', { userId: user.id })

        query.innerJoin('order.user', 'user')
        query.innerJoin('order.status', 'status')
        query.innerJoin('order.items', 'item')
        query.innerJoin('item.product', 'product')
        query.innerJoin('product.images', 'image', 'image.number = 0')
        query.innerJoin('product.infos', 'info')

        const order = await query.getOne()

        if (!order) {
            throw new NotFoundException('This user does not have an order with this id', 'OrderNotFound')
        }

        const orderDto = new OrderDto()
        orderDto.id = order.id
        orderDto.userId = order.userId
        orderDto.email = order.user.email
        orderDto.firstName = order.user.firstName
        orderDto.lastName = order.user.lastName
        orderDto.time = order.time
        orderDto.address = order.address
        orderDto.postalCode = order.postalCode
        orderDto.status = order.status.name
        orderDto.fullPrice = 0
        orderDto.items = order.items.map(item => {
            orderDto.fullPrice += item.price * item.quantity

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
                image: item.product.images[0].path,
                price: item.product.price,
                size: item.size,
                quantity: item.quantity
            }
        })

        return orderDto
    }*/

    async createOrder(user: User): Promise<{ id: number }> {
        if (!user.address || !user.postalCode) {
            throw new BadRequestException('The user does not have an address specified', 'NoAddress')
        }

        const cartItems = await this.cartItemRepository.find({
            where: { userId: user.id },
            relations: ['product'],
            order: { productId: 'ASC', size: 'ASC' }
        })
        if (cartItems.length == 0) {
            throw new BadRequestException('The cart is empty', 'EmptyCart')
        }

        const query = await this.productSizeRepository.createQueryBuilder('productSize')
        cartItems.forEach(cartItem =>
            query.orWhere(
                'productSize.productId = :productId AND productSize.size = :size',
                { productId: cartItem.productId, size: cartItem.size }
            )
        )
        query.orderBy('productSize.productId')
        query.addOrderBy('productSize.size')

        const productSizes = await query.getMany()
        if (productSizes.length < cartItems.length) {
            throw new BadRequestException('Some items from the cart are not in the store', 'InvalidCart')
        }

        for (let i = 0; i < cartItems.length; i++) {
            if (productSizes[i].quantity < cartItems[i].quantity) {
                throw new BadRequestException('Some items from the cart are not in the store', 'InvalidCart')
            }
        }

        const order = new Order()

        order.userId = user.id
        order.time = new Date()
        order.address = user.address
        order.postalCode = user.postalCode
        order.statusId = PROCESSING_STATUS_ID

        await order.save()

        for (let i = 0; i < cartItems.length; i++) {
            const orderItem = new OrderItem()
            orderItem.orderId = order.id
            orderItem.productId = cartItems[i].productId
            orderItem.size = cartItems[i].size
            orderItem.price = cartItems[i].product.price //* (100 - cartItem.product.discount) / 100
            orderItem.quantity = cartItems[i].quantity

            productSizes[i].quantity -= cartItems[i].quantity

            await productSizes[i].save()
            await cartItems[i].remove()
            await orderItem.save()
        }

        return { id: order.id }
    }
}

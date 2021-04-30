import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from 'src/common/entities/order-item.entity';
import { Order } from 'src/common/entities/order.entity';
import { ProductSize } from 'src/common/entities/product-size.entity';
import { User } from 'src/common/entities/user.entity';
import { CartItemRepository } from 'src/common/repositories/cart-item.repository';
import { OrderRepository } from 'src/common/repositories/order.repository';
import { ProductSizeRepository } from 'src/common/repositories/product-size.repository';
import { COMPLETED_STATUS_ID, DELIVERED_STATUS_ID, DELIVERING_STATUS_ID, PROCESSING_STATUS_ID, RETURN_STATUS_ID } from 'src/config/constants';
import { GetOrdersFilterDto } from './dto/get-orders-filter.dto';
import { OrderDto } from './dto/order.dto';
import { SendOrderDto } from './dto/send-order.dto';

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
            order: { updatedTime: 'DESC' }
        })

        const date = new Date()
        const dtos: OrderDto[] = []
        for (const order of orders) {
            await this.checkOrder(order, date)

            const dto = new OrderDto()
            dto.id = order.id
            dto.userId = order.userId
            dto.email = order.user.email
            dto.firstName = order.user.firstName
            dto.lastName = order.user.lastName
            dto.createdTime = order.createdTime
            dto.updatedTime = order.updatedTime
            dto.address = order.address
            dto.postalCode = order.postalCode
            dto.status = order.status.name
            dto.trackCode = order.trackCode
            dto.fullPrice = 0
            order.items.forEach(item =>
                dto.fullPrice += item.price * item.quantity
            )

            dtos.push(dto)
        }

        return dtos
    }

    async getAllOrders(filterDto: GetOrdersFilterDto): Promise<OrderDto[]> {
        const query = this.orderRepository.createQueryBuilder('order')
        query.innerJoinAndSelect('order.user', 'user')
        query.innerJoinAndSelect('order.status', 'status')
        query.innerJoinAndSelect('order.items', 'item')

        if (filterDto.status) {
            query.where('status.name = :status', { status: filterDto.status })
        }

        query.orderBy('order.updatedTime', 'DESC')

        if (filterDto.page) {
            if (filterDto.take) {
                query.skip(filterDto.take * (filterDto.page - 1))
            } else {
                query.skip(20 * (filterDto.page - 1))
            }
        }

        if (filterDto.take) {
            query.take(filterDto.take)
        } else {
            query.take(20)
        }

        const orders = await query.getMany()

        const date = new Date()
        const dtos: OrderDto[] = []
        for (const order of orders) {
            await this.checkOrder(order, date)

            const dto = new OrderDto()
            dto.id = order.id
            dto.userId = order.userId
            dto.email = order.user.email
            dto.firstName = order.user.firstName
            dto.lastName = order.user.lastName
            dto.createdTime = order.createdTime
            dto.updatedTime = order.updatedTime
            dto.address = order.address
            dto.postalCode = order.postalCode
            dto.status = order.status.name
            dto.trackCode = order.trackCode
            dto.fullPrice = 0
            order.items.forEach(item =>
                dto.fullPrice += item.price * item.quantity
            )

            dtos.push(dto)
        }

        return dtos
    }

    async getOrder(id: number, user: User): Promise<OrderDto> {
        const query = this.orderRepository.createQueryBuilder('order')
        query.select('order.id')
        query.addSelect('order.createdTime')
        query.addSelect('order.updatedTime')
        query.addSelect('order.address')
        query.addSelect('order.postalCode')
        query.addSelect('order.userId')
        query.addSelect('user.email')
        query.addSelect('user.firstName')
        query.addSelect('user.lastName')
        query.addSelect('status.name')
        query.addSelect('order.trackCode')
        query.addSelect('item.productId')
        query.addSelect('product.name')
        query.addSelect('brand.name')
        query.addSelect('product.image')
        query.addSelect('item.price')
        query.addSelect('item.size')
        query.addSelect('item.colorId')
        query.addSelect('color.name')
        query.addSelect('item.quantity')

        query.where('order.id = :id', { id })

        query.innerJoin('order.user', 'user')
        query.innerJoin('order.status', 'status')
        query.innerJoin('order.items', 'item')
        query.innerJoin('item.color', 'color')
        query.innerJoin('item.product', 'product')
        query.innerJoin('product.brand', 'brand')

        const order = await query.getOne()

        if (!order) {
            throw new NotFoundException('There is no order with this id', 'OrderNotFound')
        }

        await this.checkOrder(order, new Date())

        const orderDto = new OrderDto()
        orderDto.id = order.id
        orderDto.userId = order.userId
        orderDto.email = order.user.email
        orderDto.firstName = order.user.firstName
        orderDto.lastName = order.user.lastName
        orderDto.createdTime = order.createdTime
        orderDto.updatedTime = order.updatedTime
        orderDto.address = order.address
        orderDto.postalCode = order.postalCode
        orderDto.status = order.status.name
        orderDto.trackCode = order.trackCode
        orderDto.fullPrice = 0
        orderDto.items = order.items.map(item => {
            orderDto.fullPrice += item.price * item.quantity

            return {
                productId: item.productId,
                name: item.product.name,
                brand: item.product.brand.name,
                image: item.product.image,
                price: item.price,
                size: item.size,
                colorId: item.colorId,
                color: item.color.name,
                quantity: item.quantity
            }
        })

        return orderDto
    }

    async createOrder(user: User): Promise<{ id: number }> {
        if (!user.address || !user.postalCode) {
            throw new BadRequestException('The user does not have an address specified', 'NoAddress')
        }

        const cartItems = await this.cartItemRepository.find({
            where: { userId: user.id },
            relations: ['product']
        })
        
        if (cartItems.length == 0) {
            throw new BadRequestException('The cart is empty', 'EmptyCart')
        }

        const productSizes: ProductSize[] = []
        for (const cartItem of cartItems) {
            const query = this.productSizeRepository.createQueryBuilder('size')
            query.where('size.size = :size', { size: cartItem.size })
            query.innerJoinAndSelect(
                'size.color', 'color', 'color.productId = :productId AND color.colorId = :colorId',
                { productId: cartItem.productId, colorId: cartItem.colorId }
            )

            const productSize = await query.getOne()

            if (!productSize || productSize.quantity < cartItem.quantity) {
                throw new BadRequestException('Some items from the cart are not in the store', 'InvalidCart')
            }

            productSizes.push(productSize)
        }

        const order = new Order()

        order.userId = user.id
        order.address = user.address
        order.postalCode = user.postalCode
        order.statusId = PROCESSING_STATUS_ID

        await order.save()

        for (let i = 0; i < cartItems.length; i++) {
            const orderItem = new OrderItem()
            orderItem.orderId = order.id
            orderItem.productId = cartItems[i].productId
            orderItem.size = cartItems[i].size
            orderItem.colorId = cartItems[i].colorId
            orderItem.price = cartItems[i].product.price //* (100 - cartItem.product.discount) / 100
            orderItem.quantity = cartItems[i].quantity

            productSizes[i].quantity -= cartItems[i].quantity

            await productSizes[i].save()
            await orderItem.save()
        }

        await this.cartItemRepository.remove(cartItems)

        return { id: order.id }
    }

    async sendOrder(id: number, sendOrderDto: SendOrderDto): Promise<{ id: number }> {
        const order = await this.orderRepository.findOne(id)

        if (!order) {
            throw new NotFoundException('There is no order with this id', 'OrderNotFound')
        }

        if (order.statusId != PROCESSING_STATUS_ID) {
            throw new BadRequestException('The order is no longer being processed', 'OrderStatusNotProcessing')
        }

        order.statusId = DELIVERING_STATUS_ID
        order.trackCode = sendOrderDto.trackCode
        await order.save()

        return { id }
    }

    async deliverOrder(id: number, user: User): Promise<{ id: number }> {
        const order = await this.orderRepository.findOne({ id, userId: user.id })

        if (!order) {
            throw new NotFoundException('This user does not have an order with this id', 'OrderNotFound')
        }

        await this.checkOrder(order, new Date())

        if (order.statusId != DELIVERING_STATUS_ID) {
            throw new BadRequestException('The order is no being delivering', 'OrderStatusNotDelivering')
        }

        order.statusId = DELIVERED_STATUS_ID
        await order.save()

        return { id }
    }

    async returnOrder(id: number, user: User): Promise<{ id: number }> {
        const order = await this.orderRepository.findOne({ id, userId: user.id })

        if (!order) {
            throw new NotFoundException('This user does not have an order with this id', 'OrderNotFound')
        }

        await this.checkOrder(order, new Date())

        if (order.statusId != DELIVERED_STATUS_ID) {
            throw new BadRequestException('The order is no being delivered', 'OrderStatusNotDelivered')
        }

        order.statusId = RETURN_STATUS_ID
        await order.save()

        return { id }
    }

    async cancelReturn(id: number): Promise<{ id: number }> {
        const order = await this.orderRepository.findOne({ id })

        if (!order) {
            throw new NotFoundException('There is no order with this id', 'OrderNotFound')
        }

        if (order.statusId != RETURN_STATUS_ID) {
            throw new BadRequestException('The order is no being return', 'OrderStatusNotReturn')
        }

        order.statusId = COMPLETED_STATUS_ID
        await order.save()

        return { id }
    }

    async returnMoney(id: number): Promise<{ message: string }> {
        const order = await this.orderRepository.findOne({ id })

        if (!order) {
            throw new NotFoundException('There is no order with this id', 'OrderNotFound')
        }

        if (order.statusId != RETURN_STATUS_ID) {
            throw new BadRequestException('The order is no being return', 'OrderStatusNotReturn')
        }

        await order.remove()

        return { message: 'Returned' }
    }

    private async checkOrder(order: Order, date: Date): Promise<void> {
        if (order.statusId === DELIVERED_STATUS_ID && (Number(date) - Number(order.updatedTime)) / 1000 / 60 / 60 / 24 > 2) {
            order.statusId = COMPLETED_STATUS_ID
            await order.save()
        }

        if (order.statusId === DELIVERING_STATUS_ID && (Number(date) - Number(order.updatedTime)) / 1000 / 60 / 60 / 24 > 14) {
            order.statusId = COMPLETED_STATUS_ID
            await order.save()
        }
    }
}

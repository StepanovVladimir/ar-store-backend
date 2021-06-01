import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/common/entities/order.entity';
import { User } from 'src/common/entities/user.entity';
import { OrderStatusRepository } from 'src/common/repositories/order-status.repository';
import { OrderRepository } from 'src/common/repositories/order.repository';
import { ProductSizeRepository } from 'src/common/repositories/product-size.repository';
import { COMPLETED_STATUS_ID, DELIVERED_STATUS_ID, DELIVERING_STATUS_ID, PROCESSING_STATUS_ID, RETURNED_STATUS_ID, RETURN_STATUS_ID } from 'src/config/constants';
import { CreateOrderDto } from './dto/create-order.dto';
import { EstimateOrderDto } from './dto/estimate-order.dto';
import { EstimationsDto } from './dto/estimations.dto';
import { GetOrdersFilterDto } from './dto/get-orders-filter.dto';
import { OrderDto } from './dto/order.dto';
import { OrdersDto } from './dto/orders.dto';
import { SendOrderDto } from './dto/send-order.dto';
import * as moment from 'moment';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(OrderRepository)
        private orderRepository: OrderRepository,

        @InjectRepository(OrderStatusRepository)
        private orderStatusRepository: OrderStatusRepository,

        @InjectRepository(ProductSizeRepository)
        private productSizeRepository: ProductSizeRepository
    ) {}

    async getOrders(user: User): Promise<OrderDto[]> {
        const query = this.orderRepository.createQueryBuilder('order')
        query.where('order.userId = :userId', { userId: user.id })

        query.innerJoinAndSelect('order.status', 'status')
        query.innerJoinAndSelect('order.color', 'color')
        query.innerJoinAndSelect('order.product', 'product')
        query.innerJoinAndSelect('product.brand', 'brand')

        query.orderBy('order.updatedTime', 'DESC')

        const orders = await query.getMany()

        const date = new Date()
        const dtos: OrderDto[] = []
        for (const order of orders) {
            await this.checkOrder(order, date)

            const dto = new OrderDto()
            dto.id = order.id
            dto.userId = order.userId
            dto.createdTime = moment(order.createdTime.setHours(order.createdTime.getHours() + 3)).format('DD.MM.YYYY HH:mm')
            dto.updatedTime = moment(order.updatedTime.setHours(order.updatedTime.getHours() + 3)).format('DD.MM.YYYY HH:mm')
            dto.address = order.address
            dto.postalCode = order.postalCode
            dto.status = order.status.name
            dto.trackCode = order.trackCode
            dto.productId = order.productId
            dto.productName = order.product.name
            dto.brand = order.product.brand.name
            dto.image = order.product.image
            dto.price = order.price
            dto.colorId = order.colorId
            dto.color = order.color.name
            dto.size = order.size
            dto.estimation = order.estimation
            dto.comment = order.comment
            dto.estimationDate = order.estimationDate
                ? moment(order.estimationDate.setHours(order.estimationDate.getHours() + 3)).format('DD.MM.YYYY HH:mm')
                : null

            dtos.push(dto)
        }

        return dtos
    }

    async getAllOrders(filterDto: GetOrdersFilterDto): Promise<OrdersDto> {
        const query = this.orderRepository.createQueryBuilder('order')
        query.innerJoinAndSelect('order.user', 'user')
        query.innerJoinAndSelect('order.status', 'status')
        query.innerJoinAndSelect('order.color', 'color')
        query.innerJoinAndSelect('order.product', 'product')
        query.innerJoinAndSelect('product.brand', 'brand')

        if (filterDto.search) {
            query.andWhere(
                '(user.email ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search OR product.name ILIKE :search '
                + 'OR brand.name ILIKE :search)',
                { search: `%${filterDto.search}%` }
            )
        }

        if (filterDto.status) {
            query.andWhere('status.name = :status', { status: filterDto.status })
        }

        query.orderBy('order.updatedTime', 'DESC')

        const productsCount = await query.getCount()

        if (filterDto.page) {
            if (filterDto.take) {
                query.skip(filterDto.take * (filterDto.page - 1))
            } else {
                query.skip(20 * (filterDto.page - 1))
            }
        }

        const pageSize = filterDto.take ? filterDto.take : 20
        query.take(pageSize)

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
            dto.createdTime = moment(order.createdTime.setHours(order.createdTime.getHours() + 3)).format('DD.MM.YYYY HH:mm')
            dto.updatedTime = moment(order.updatedTime.setHours(order.updatedTime.getHours() + 3)).format('DD.MM.YYYY HH:mm')
            dto.address = order.address
            dto.postalCode = order.postalCode
            dto.status = order.status.name
            dto.trackCode = order.trackCode
            dto.productId = order.productId
            dto.productName = order.product.name
            dto.brand = order.product.brand.name
            dto.image = order.product.image
            dto.price = order.price
            dto.colorId = order.colorId
            dto.color = order.color.name
            dto.size = order.size
            dto.estimation = order.estimation
            dto.comment = order.comment
            dto.estimationDate = order.estimationDate
                ? moment(order.estimationDate.setHours(order.estimationDate.getHours() + 3)).format('DD.MM.YYYY HH:mm')
                : null

            dtos.push(dto)
        }

        return {
            pageCount: Math.ceil(productsCount / pageSize),
            orders: dtos
        }
    }

    async getComments(filterDto: GetOrdersFilterDto): Promise<EstimationsDto> {
        const query = this.orderRepository.createQueryBuilder('order')
        query.select('order.id')
        query.addSelect('user.email')
        query.addSelect('user.firstName')
        query.addSelect('user.lastName')
        query.addSelect('order.estimation')
        query.addSelect('order.comment')
        query.addSelect('order.estimationDate')
        query.addSelect('order.productId')
        query.addSelect('product.name')
        query.addSelect('brand.name')

        query.innerJoin('order.user', 'user')
        query.innerJoin('order.product', 'product')
        query.innerJoin('product.brand', 'brand')

        query.where('order.comment IS NOT NULL')

        if (filterDto.search) {
            query.andWhere(
                '(user.email ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search OR product.name ILIKE :search '
                + 'OR brand.name ILIKE :search)',
                { search: `%${filterDto.search}%` }
            )
        }

        query.orderBy('order.estimationDate', 'DESC')

        const productsCount = await query.getCount()

        if (filterDto.page) {
            if (filterDto.take) {
                query.skip(filterDto.take * (filterDto.page - 1))
            } else {
                query.skip(20 * (filterDto.page - 1))
            }
        }

        const pageSize = filterDto.take ? filterDto.take : 20
        query.take(pageSize)

        const comments = await query.getMany()

        return {
            pageCount: Math.ceil(productsCount / pageSize),
            estimations: comments.map(comment => ({
                orderId: comment.id,
                email: comment.user.email,
                firstName: comment.user.firstName,
                lastName: comment.user.lastName,
                productId: comment.productId,
                productName: comment.product.name,
                brand: comment.product.brand.name,
                estimation: comment.estimation,
                comment: comment.comment,
                estimationDate: comment.estimationDate
                    ? moment(comment.estimationDate.setHours(comment.estimationDate.getHours() + 3)).format('DD.MM.YYYY HH:mm')
                    : null
            }))
        } 
    }

    async createOrder(createOrderDto: CreateOrderDto, user: User): Promise<{ id: number }> {
        if (!user.address || !user.postalCode) {
            throw new BadRequestException('The user does not have an address specified', 'NoAddress')
        }

        const query = this.productSizeRepository.createQueryBuilder('size')
        query.where('size.size = :size', { size: createOrderDto.size })
        query.innerJoinAndSelect(
            'size.color', 'color', 'color.productId = :productId AND color.colorId = :colorId',
            { productId: createOrderDto.productId, colorId: createOrderDto.colorId }
        )
        query.innerJoinAndSelect('color.product', 'product')

        const productSize = await query.getOne()

        if (!productSize || productSize.quantity == 0) {
            throw new BadRequestException('Product with this id, colorId and size are not in the store', 'InvalidOrder')
        }

        const order = new Order()
        const date = new Date()

        order.userId = user.id
        order.createdTime = date
        order.updatedTime = date
        order.address = user.address
        order.postalCode = user.postalCode
        order.statusId = PROCESSING_STATUS_ID
        order.productId = createOrderDto.productId
        order.colorId = createOrderDto.colorId
        order.size = createOrderDto.size
        order.price = productSize.color.product.price

        productSize.quantity--

        await productSize.save()
        await order.save()

        return { id: order.id }
    }

    async estimateProduct(estimateOrderDto: EstimateOrderDto, user: User): Promise<{ message: string }> {
        const order = await this.orderRepository.findOne({ id: estimateOrderDto.orderId, userId: user.id })

        if (!order) {
            throw new NotFoundException('This user does not have an order with this id', 'OrderNotFound')
        }

        if (order.statusId == PROCESSING_STATUS_ID || order.statusId == DELIVERING_STATUS_ID) {
            throw new BadRequestException('You can\'t comment on the order yet', 'CanNotCommentOrder')
        }

        order.estimation = estimateOrderDto.estimation
        if (estimateOrderDto.comment) {
            order.comment = estimateOrderDto.comment
        } else {
            order.comment = null
        }
        
        order.estimationDate = new Date()
        await order.save()

        return { message: 'Estimated' }
    }

    async deleteComment(id: number): Promise<{ id: number }> {
        const order = await this.orderRepository.findOne(id)

        if (!order) {
            throw new NotFoundException('There is no order with this id', 'OrderNotFound')
        }

        order.comment = null
        await order.save()

        return { id }
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
        order.updatedTime = new Date()
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
        order.updatedTime = new Date()
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
        order.updatedTime = new Date()
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
        order.updatedTime = new Date()
        await order.save()

        return { id }
    }

    async returnMoney(id: number): Promise<{ id: number }> {
        const order = await this.orderRepository.findOne({ id })

        if (!order) {
            throw new NotFoundException('There is no order with this id', 'OrderNotFound')
        }

        if (order.statusId != RETURN_STATUS_ID) {
            throw new BadRequestException('The order is no being return', 'OrderStatusNotReturn')
        }

        const query = this.productSizeRepository.createQueryBuilder('size')
        query.where('size.size = :size', { size: order.size })
        query.innerJoin(
            'size.color', 'color', 'color.productId = :productId AND color.colorId = :colorId',
            { productId: order.productId, colorId: order.colorId }
        )

        const productSize = await query.getOne()

        if (productSize) {
            productSize.quantity++
            await productSize.save()
        }

        order.statusId = RETURNED_STATUS_ID
        order.updatedTime = new Date()
        await order.save()

        return { id }
    }

    private async checkOrder(order: Order, date: Date): Promise<void> {
        if (order.statusId == DELIVERED_STATUS_ID && (Number(date) - Number(order.updatedTime)) / 1000 / 60 / 60 / 24 > 7) {
            order.statusId = COMPLETED_STATUS_ID
            order.status = await this.orderStatusRepository.findOne(COMPLETED_STATUS_ID)
            order.updatedTime = date
            await order.save()
        }

        if (order.statusId == DELIVERING_STATUS_ID && (Number(date) - Number(order.updatedTime)) / 1000 / 60 / 60 / 24 > 28) {
            order.statusId = COMPLETED_STATUS_ID
            order.status = await this.orderStatusRepository.findOne(COMPLETED_STATUS_ID)
            order.updatedTime = date
            await order.save()
        }
    }
}

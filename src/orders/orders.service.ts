import { Injectable } from '@nestjs/common';
import { OrderItem } from 'src/entities/order-item.entity';
import { Order } from 'src/entities/order.entity';
import { User } from 'src/entities/user.entity';
import { OrdersInterface } from 'src/orders/orders.interface';

@Injectable()
export class OrdersService implements OrdersInterface {
    private orders: Order[] = []
    private orderItems: OrderItem[] = []
    private orderId: number = 1

    createOrder(user: User) {
        const order = new Order()

        order.userId = user.id
        order.time = new Date()

        order.id = this.orderId
        this.orderId++

        this.orders.push(order)
        
        user.cartItems.forEach(cartItem => {
            const orderItem = new OrderItem()

            orderItem.orderId = order.id
            orderItem.productId = cartItem.productId
            orderItem.price = cartItem.product.price
            orderItem.quantity = cartItem.quantity

            this.orderItems.push(orderItem)
        })
    }
}

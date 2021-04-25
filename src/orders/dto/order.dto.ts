import { OrderItemDto } from "./order-item.dto"

export class OrderDto {
    id: number
    userId: number
    email: string
    firstName: string
    lastName: string
    time: Date
    address: string
    postalCode: string
    status: string
    fullPrice: number
    items: OrderItemDto[]
}
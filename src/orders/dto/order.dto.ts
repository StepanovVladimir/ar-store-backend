import { OrderItemDto } from "./order-item.dto"

export class OrderDto {
    id: number
    userId: number
    email: string
    firstName: string
    lastName: string
    createdTime: Date
    updatedTime: Date
    address: string
    postalCode: string
    status: string
    trackCode: string
    fullPrice: number
    items: OrderItemDto[]
}
import { OrderItemDto } from "./order-item.dto"

export class OrderDto {
    id: number
    time: Date
    address: string
    postalCode: string
    status: string
    fullPrice: number
    items: OrderItemDto[]
}
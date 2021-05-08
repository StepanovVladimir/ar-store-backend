import { IsNotEmpty, Max, Min } from "class-validator";

export class EstimateOrderDto {
    @IsNotEmpty()
    orderId: number

    @Min(1)
    @Max(5)
    estimation: number

    comment: string
}
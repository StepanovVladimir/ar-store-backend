import { IsNotEmpty } from "class-validator";

export class SendOrderDto {
    @IsNotEmpty()
    trackCode: string
}
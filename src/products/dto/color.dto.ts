import { IsNotEmpty } from "class-validator";
import { SizeDto } from "./size.dto";

export class ColorDto {
    @IsNotEmpty()
    colorId: number

    color?: string

    @IsNotEmpty()
    texture: string

    sizes?: SizeDto[]
}
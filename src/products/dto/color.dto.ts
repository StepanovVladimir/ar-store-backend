import { IsNotEmpty } from "class-validator";

export class ColorDto {
    @IsNotEmpty()
    colorId: number

    color?: string

    @IsNotEmpty()
    texture: string
}
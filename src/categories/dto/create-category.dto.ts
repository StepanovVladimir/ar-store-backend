import { IsIn, IsNotEmpty } from "class-validator";
import { AVAILABLE_LANGS } from "src/config/constants";

export class CreateCategoryDto {
    @IsIn(AVAILABLE_LANGS)
    lang: string

    @IsNotEmpty()
    name: string
}
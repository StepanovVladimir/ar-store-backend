import { IsNotEmpty, IsOptional } from "class-validator";

export class GetProductsFilterDto {
    @IsOptional()
    @IsNotEmpty()
    search: string

    @IsOptional()
    size: number

    @IsOptional()
    categoryId: number
}
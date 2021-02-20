import { IsNotEmpty, IsOptional } from "class-validator";

export class GetProductsFilterDto {
    @IsOptional()
    categoryId: number

    @IsOptional()
    @IsNotEmpty()
    search: string
}
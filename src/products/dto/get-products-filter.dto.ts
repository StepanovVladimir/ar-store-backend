export class GetProductsFilterDto {
    search: string
    
    brandId: number
    typeId: number
    genderId: number
    seasonId: number
    size: number
    minPrice: number
    maxPrice: number

    skip: number
    take: number
}
import { BadRequestException, PipeTransform } from "@nestjs/common"
import { PartialUpdateProductDto } from "../dto/partial-update-product.dto"

export class ProductQuantitiesValidationPipe implements PipeTransform<PartialUpdateProductDto, PartialUpdateProductDto> {
    transform(value: PartialUpdateProductDto): PartialUpdateProductDto {
        value.quantities.forEach(quantity => {
            if (quantity.size < 35 || quantity.size > 50) {
                throw new BadRequestException('Size must have a value between 35 and 50', 'SizeNotValid')
            }
        })

        return value
    }
}
import { BadRequestException, PipeTransform } from "@nestjs/common"
import { QuantitiesDto } from "../dto/quantities.dto"

export class ProductQuantitiesValidationPipe implements PipeTransform<QuantitiesDto, QuantitiesDto> {
    transform(value: QuantitiesDto): QuantitiesDto {
        value.quantities.forEach(quantity => {
            if (quantity.size < 35 || quantity.size > 50) {
                throw new BadRequestException('Size must have a value between 35 and 50', 'SizeNotValid')
            }
        })

        return value
    }
}
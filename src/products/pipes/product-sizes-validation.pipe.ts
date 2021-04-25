import { BadRequestException, PipeTransform } from "@nestjs/common";
import { CreateProductDto } from "../dto/create-product.dto";

export class ProductSizesValidationPipe implements PipeTransform<CreateProductDto, CreateProductDto> {
    transform(value: CreateProductDto): CreateProductDto {
        value.sizes.forEach(size => {
            if (size < 35 || size > 50) {
                throw new BadRequestException('Size must have a value between 35 and 50', 'SizeNotValid')
            }
        })

        return value
    }
}
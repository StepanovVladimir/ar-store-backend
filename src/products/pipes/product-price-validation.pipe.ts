import { BadRequestException, PipeTransform } from "@nestjs/common";

export class ProductPriceValidationPipe implements PipeTransform<number, number> {
    transform(value: number): number {
        if (value <= 0) {
            throw new BadRequestException()
        }

        return value
    }
}
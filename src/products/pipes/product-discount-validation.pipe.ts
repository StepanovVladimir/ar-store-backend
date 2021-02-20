import { BadRequestException, PipeTransform } from "@nestjs/common";

export class ProductDiscountValidationPipe implements PipeTransform<number, number> {
    transform(value: number): number {
        if (value < 0 || value > 100) {
            throw new BadRequestException()
        }

        return value
    }
}
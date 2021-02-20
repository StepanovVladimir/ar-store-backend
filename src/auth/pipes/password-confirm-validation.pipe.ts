import { BadRequestException, PipeTransform } from "@nestjs/common";
import { SignUpDto } from "../dto/sign-up.dto";

export class PasswordConfirmValidationPipe implements PipeTransform<SignUpDto, SignUpDto> {
    transform(value: SignUpDto) {
        if (value.password !== value.passwordConfirm) {
            throw new BadRequestException()
        }

        return value
    }
}
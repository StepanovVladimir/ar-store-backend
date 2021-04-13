import { BadRequestException, PipeTransform } from "@nestjs/common";

export class PasswordConfirmValidationPipe implements PipeTransform {
    transform(value) {
        if (value.password !== value.passwordConfirm) {
            throw new BadRequestException('Passwords don\'t match', 'PasswordsNotMatch')
        }

        return value
    }
}
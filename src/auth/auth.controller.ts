import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthInterface } from './auth.interface';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { PasswordConfirmValidationPipe } from './pipes/password-confirm-validation.pipe';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthInterface) {}

    @Post('/signup')
    signUp(@Body(ValidationPipe, PasswordConfirmValidationPipe) signUpDto: SignUpDto): Promise<{ id: number }> {
        return this.authService.signUp(signUpDto)
    }

    @Post('/signin')
    signIn(@Body(ValidationPipe) signInDto: SignInDto): Promise<{ accessToken: string }> {
        return this.authService.signIn(signInDto)
    }
}

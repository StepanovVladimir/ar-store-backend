import { Body, Controller, Get, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/entities/user.entity';
import { AuthInterface } from './auth.interface';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { GetUser } from '../decorators/get-user.decorator';
import { PasswordConfirmValidationPipe } from './pipes/password-confirm-validation.pipe';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthInterface) {}

    @Post('/signup')
    signUp(@Body(ValidationPipe, PasswordConfirmValidationPipe) signUpDto: SignUpDto): Promise<{ accessToken: string }> {
        return this.authService.signUp(signUpDto)
    }

    @Post('/signin')
    signIn(@Body(ValidationPipe) signInDto: SignInDto): Promise<{ accessToken: string }> {
        return this.authService.signIn(signInDto)
    }

    /*@Get('/google')
    @UseGuards(AuthGuard("google"))
    async googleAuth(@GetUser() user: User) {
        
    }

    @Get('/google/callback')
    @UseGuards(AuthGuard("google"))
    async googleAuthCallback(@GetUser() user: User) {
        return user
    }*/

    @Post('/test')
    @UseGuards(AuthGuard())
    test(@GetUser() user: User) {
        console.log(user)
    }
}

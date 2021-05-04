import { Body, Controller, Get, Param, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/common/entities/user.entity';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PasswordConfirmValidationPipe } from './pipes/password-confirm-validation.pipe';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signup')
    signUp(@Body(ValidationPipe, PasswordConfirmValidationPipe) signUpDto: SignUpDto): Promise<{ id: number }> {
        return this.authService.signUp(signUpDto)
    }

    @Post('/signin')
    signIn(@Body(ValidationPipe) signInDto: SignInDto): Promise<{ accessToken: string }> {
        return this.authService.signIn(signInDto)
    }

    @Get('/confirmation/:token')
    confirmEmail(@Param('token') token: string): Promise<string> {
        return this.authService.confirmEmail(token)
    }

    @Post('/resubmit')
    resubmitConfirmMessage(@Body(ValidationPipe) signInDto: SignInDto): Promise<{ id: number }> {
        return this.authService.resubmitConfirmMessage(signInDto)
    }

    @Put('/change-password')
    @UseGuards(AuthGuard())
    changePassword(
        @GetUser() user: User,
        @Body(ValidationPipe, PasswordConfirmValidationPipe) changePasswordDto: ChangePasswordDto
    ): Promise<{ message: string }> {
        return this.authService.changePassword(user, changePasswordDto)
    }

    @Put('/address')
    @UseGuards(AuthGuard())
    updateAddress(@GetUser() user: User, @Body(ValidationPipe) updateAddressDto: UpdateAddressDto): Promise<{ message: string }> {
        return this.authService.updateAddress(user, updateAddressDto)
    }
}

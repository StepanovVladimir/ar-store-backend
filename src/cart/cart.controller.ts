import { Body, Controller, Delete, Get, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetLang } from 'src/common/decorators/get-lang.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/common/entities/user.entity';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CartItemDto } from './dto/cart-item.dto';

@Controller('cart')
@UseGuards(AuthGuard())
export class CartController {
    constructor(private cartService: CartService) {}

    @Get()
    getCartItems(@GetUser() user: User, @GetLang() lang: string): Promise<CartItemDto[]> {
        return this.cartService.getCartItems(user, lang)
    }

    @Post()
    addToCart(@GetUser() user: User, @Body(ValidationPipe) addToCartDto: AddToCartDto): Promise<{ message: string }> {
        return this.cartService.addToCart(user, addToCartDto)
    }

    @Delete()
    deleteFromCart(@GetUser() user: User, @Body(ValidationPipe) deleteFromCartDto: AddToCartDto): Promise<{ message: string }> {
        return this.cartService.deleteFromCart(user, deleteFromCartDto)
    }
}

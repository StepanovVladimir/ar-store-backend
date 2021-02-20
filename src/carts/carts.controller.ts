import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';

@Controller('carts')
export class CartsController {
    @Get()
    getCartItems() {

    }

    @Post('/:productId')
    addToCart(@Param('productId', ParseIntPipe) productId: number) {
        
    }
}

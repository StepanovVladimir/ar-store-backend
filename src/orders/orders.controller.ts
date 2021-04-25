import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { HasRoles } from 'src/common/decorators/has-roles.decorator';
import { User } from 'src/common/entities/user.entity';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { SELLER_ROLE } from 'src/config/constants';
import { OrderDto } from './dto/order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(AuthGuard())
export class OrdersController {
    constructor(
        private ordersService: OrdersService
    ) {}

    @Get()
    getOrders(@GetUser() user: User): Promise<OrderDto[]> {
        return this.ordersService.getOrders(user)
    }

    /*@Get('/:id')
    getOrder(@Param('id', ParseIntPipe) id: number, @GetUser() user: User, @GetLang() lang: string): Promise<OrderDto> {
        return this.ordersService.getOrder(id, user, lang)
    }*/

    @Post()
    createOrder(@GetUser() user: User): Promise<{ id: number }> {
        return this.ordersService.createOrder(user)
    }

    @Put('/:id')
    @HasRoles(SELLER_ROLE)
    @UseGuards(RolesGuard)
    sendOrder(@Param('id', ParseIntPipe) id: number)/*: Promise<{ id: number }>*/ {

    }
}

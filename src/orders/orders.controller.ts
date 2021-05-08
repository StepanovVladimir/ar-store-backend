import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { HasRoles } from 'src/common/decorators/has-roles.decorator';
import { User } from 'src/common/entities/user.entity';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { SELLER_ROLE } from 'src/config/constants';
import { CreateOrderDto } from './dto/create-order.dto';
import { EstimateOrderDto } from './dto/estimate-order.dto';
import { GetOrdersFilterDto } from './dto/get-orders-filter.dto';
import { OrderDto } from './dto/order.dto';
import { SendOrderDto } from './dto/send-order.dto';
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

    @Get('/all')
    @HasRoles(SELLER_ROLE)
    @UseGuards(RolesGuard)
    getAllOrders(@Query() filterDto: GetOrdersFilterDto) {
        return this.ordersService.getAllOrders(filterDto)
    }

    @Post()
    createOrder(@Body(ValidationPipe) createOrderDto: CreateOrderDto, @GetUser() user: User): Promise<{ id: number }> {
        return this.ordersService.createOrder(createOrderDto, user)
    }

    @Post('/estimation')
    estimateProduct(@Body(ValidationPipe) estimateOrderDto: EstimateOrderDto, @GetUser() user: User): Promise<{ message: string }> {
        return this.ordersService.estimateProduct(estimateOrderDto, user)
    }

    @Patch('/:id/send')
    @HasRoles(SELLER_ROLE)
    @UseGuards(RolesGuard)
    sendOrder(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) sendOrderDto: SendOrderDto): Promise<{ id: number }> {
        return this.ordersService.sendOrder(id, sendOrderDto)
    }

    @Patch('/:id/deliver')
    deliverOrder(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<{ id: number }> {
        return this.ordersService.deliverOrder(id, user)
    }

    @Patch('/:id/return')
    returnOrder(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<{ id: number }> {
        return this.ordersService.returnOrder(id, user)
    }

    @Patch('/:id/cancel-return')
    @HasRoles(SELLER_ROLE)
    @UseGuards(RolesGuard)
    cancelReturn(@Param('id', ParseIntPipe) id: number): Promise<{ id: number }> {
        return this.ordersService.cancelReturn(id)
    }

    @Patch('/:id/return-money')
    @HasRoles(SELLER_ROLE)
    @UseGuards(RolesGuard)
    returnMoney(@Param('id', ParseIntPipe) id: number): Promise<{ id: number }> {
        return this.ordersService.returnMoney(id)
    }
}

import { Controller, Get, Req, HttpStatus, Post, Body } from '@nestjs/common';

import { Checkout, OrderService } from '../order';
import { AppRequest, getUserIdFromRequest } from '../shared';

import { calculateCartTotal } from './models-rules';
import { CartService } from './services';

@Controller('api/profile')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
  ) {}

  @Get('cart')
  async findUserCart(@Req() req: AppRequest) {
    const cart = await this.cartService.findOrCreateByUserId(
      getUserIdFromRequest(req),
    );

    console.log('Cart is retrieved ', cart);
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { cart, total: calculateCartTotal(cart) },
    };
  }

  @Get('orders')
  async findUserOrders(@Req() req: AppRequest) {
    console.log('findUserOrders request: ', req);

    try {
      const orders = await this.orderService.getAllForUser(
        getUserIdFromRequest(req),
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: { orders },
      };
    } catch (e) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'OK',
        data: { message: 'Orders load failed' },
      };
    }
  }
  @Post('cart/checkout')
  async checkout(@Req() req: AppRequest, @Body() body: Checkout) {
    console.log('checkout request: ', body);

    const userId = getUserIdFromRequest(req);
    if (userId === null) {
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        data: { message: 'Not authorized' },
      };
    }

    console.log('User ID: ', userId);
    try {
      const cart = await this.cartService.findByUserId(userId);
      await this.orderService.create(userId, cart.id, body);
      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: { message: 'Order creation succeeded' },
      };
    } catch (e) {
      console.log('Order creation error: ', e);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'OK',
        data: { message: 'Order creation failed' },
      };
    }
  }
}

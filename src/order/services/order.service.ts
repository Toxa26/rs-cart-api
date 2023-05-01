import { Injectable } from '@nestjs/common';

import { Order } from '../models';
import { ProductCheckout } from '../../cart';
import { InjectConnection } from 'nest-postgres';
import { Client } from 'pg';

export interface Checkout {
  products: ProductCheckout[];
  shipping: {
    lastName: string;
    firstName: string;
    address: string;
    comment: string;
  };
}

@Injectable()
export class OrderService {
  constructor(
    @InjectConnection('dbConnection')
    private dbConnection: Client,
  ) {}

  private orders: Record<string, Order> = {};

  async getAllForUser(userId: string): Promise<Order[]> {
    const orders = await this.dbConnection.query<Order>(
      `select * from orders LEFT JOIN carts ON orders.cart_id = carts.id WHERE user_id = '${userId}';`,
    );
    return orders.rows;
  }

  async create(userId: string, cartId: string, data: Checkout): Promise<void> {
    try {
      const query = `insert into orders (last_name, first_name, address, comment, cart_id) values ('${data.shipping.lastName}', '${data.shipping.firstName}', '${data.shipping.address}', '${data.shipping.comment}', '${cartId}');`;
      console.log('create order query: ', query);
      await this.dbConnection.query(query);
    } catch (e) {
      console.log('create failed', e);
      throw new Error(`Error while creating order ${e}`);
    }
  }
}

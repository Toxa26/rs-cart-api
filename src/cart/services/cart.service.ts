import { Injectable } from '@nestjs/common';
import { Cart } from '../models';
import { Client, QueryResult } from 'pg';
import { InjectConnection } from 'nest-postgres';

@Injectable()
export class CartService {
  constructor(
    @InjectConnection('dbConnection')
    private dbConnection: Client,
  ) {}

  async findByUserId(userId: string): Promise<Cart> {
    const id = userId || '39dfdc11-7d1f-4a71-914c-719481da309b';

    try {
      const queryCartsText = `select * from carts where user_id = '${id}'`;
      const result = await this.dbConnection.query(queryCartsText);
      const cart = result.rows[0];

      const queryItemsText = `select * from cart_items where cart_id = '${cart.id}'`;
      const items = (await this.dbConnection.query(queryItemsText)).rows;

      cart.items = items.map((item) => {
        item.product = {
          id: item.product_id
        }
        return item;
      });

      return cart;

    } catch(e) {
      console.log(e);
    } finally {
      await this.dbConnection.end();
    }
  }

  async createByUserId(userId: string): Promise<QueryResult> {
    console.log('createByUserId is called with User ID:', userId);
    const cart = await this.dbConnection.query<Cart>(
      `insert into carts (created_at, updated_at, user_id) values ('2023-04-20', '2023-04-20', '${userId}');`,
    );
    console.log(`cart created for user with id ${userId}:`, cart);
    return cart;
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    console.log('USER ID', userId);
    try {
      return await this.findByUserId(userId);
    } catch (e) {
      await this.createByUserId(userId);
    }
    return await this.findByUserId(userId);
  }

  async updateByUserId(userId: string, { items }: Cart): Promise<Cart> {
    const { id } = await this.findOrCreateByUserId(userId);

    await this.dbConnection.query(
      `delete from cart_items where user_id = ${userId}`,
    );
    const updatedCartItems = await this.dbConnection.query(
      `insert into cart_items (cart_id, count, product_id) values (${items.map(
        item => `'${id}', ${item.count}, '${item.productId}'`,
      )});`,
    );

    return { id, items: updatedCartItems.rows };
  }
}

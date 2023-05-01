import { Cart, CartItem } from '../models';

/**
 * @param {Cart} cart
 * @returns {number}
 */
export function calculateCartTotal(cart: Cart): number {
  return cart ? cart.items.reduce((acc: number, cartItem: CartItem) => {
    return acc += cartItem.count;
  }, 0) : 0;
}

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  img: string;
  count: number;
};

export type CartItem = {
  // product: Product,
  productId: string;
  count: number;
};

export type Cart = {
  id: string;
  items: CartItem[];
};

export interface ProductCheckout extends Product {
  orderedCount: number;
  totalPrice: number;
}


export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerPhone: string;
  status: 'Placed' | 'Processing' | 'Shipped' | 'Delivered';
  timestamp: Date;
}

export enum View {
  Store,
  Cart,
  TrackOrder,
  Admin,
}

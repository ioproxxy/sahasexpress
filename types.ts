export interface Review {
  author: string;
  rating: number; // 1-5
  comment: string;
}

export interface VariantOption {
  name: string;
  values: string[];
}

export interface ProductVariant {
  id: string; // e.g., 'size-M_color-Red'
  options: { [key: string]: string }; // e.g., { Size: 'M', Color: 'Red' }
  stock: number;
}


export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number; // Will be the total stock of all variants if they exist
  imageUrl: string;
  description: string;
  reviews?: Review[];
  variantOptions?: VariantOption[];
  variants?: ProductVariant[];
}

export interface CartItem extends Product {
  quantity: number;
  variant?: ProductVariant;
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
  OrderConfirmation,
}

export enum SortOption {
  Default = 'default',
  PriceAsc = 'price-asc',
  PriceDesc = 'price-desc',
  NameAsc = 'name-asc',
  NameDesc = 'name-desc',
}
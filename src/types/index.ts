export type ProductCategory = 
  | 'mens_tshirts' | 'mens_shirts' | 'mens_trousers' | 'mens_jeans' | 'mens_jackets' | 'mens_shorts'
  | 'womens_tops' | 'womens_dresses' | 'womens_skirts' | 'womens_trousers' | 'womens_jackets' | 'womens_loungewear';

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type OrderStatus = 'placed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';

export type PaymentMethod = 'upi' | 'card' | 'net_banking' | 'cod';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  category: ProductCategory;
  gender: 'men' | 'women';
  sizes: ProductSize[];
  colors: string[];
  images: string[];
  in_stock: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  created_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  size: ProductSize;
  quantity: number;
  created_at: string;
  product?: Product;
}

export interface Order {
  id: string;
  user_id: string;
  address_id: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  estimated_delivery: string | null;
  created_at: string;
  updated_at: string;
  address?: Address;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  size: ProductSize;
  quantity: number;
  price: number;
  created_at: string;
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  mens_tshirts: "Men's T-Shirts",
  mens_shirts: "Men's Shirts",
  mens_trousers: "Men's Trousers",
  mens_jeans: "Men's Jeans",
  mens_jackets: "Men's Jackets",
  mens_shorts: "Men's Shorts",
  womens_tops: "Women's Tops",
  womens_dresses: "Women's Dresses",
  womens_skirts: "Women's Skirts",
  womens_trousers: "Women's Trousers",
  womens_jackets: "Women's Jackets",
  womens_loungewear: "Women's Loungewear",
};

export const SIZE_ORDER: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

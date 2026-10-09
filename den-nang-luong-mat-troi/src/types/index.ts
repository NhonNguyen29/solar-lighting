export type ProductCategory = 'street' | 'flood' | 'garden' | 'indoor';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  categoryName: string;
  powerWatt: number;
  price: number;
  originalPrice: number;
  batteryCapacity: string;
  solarPanel: string;
  ipRating: string;
  lightingTime: string;
  lightingArea: string;
  ledChip: string;
  imageUrl: string;
  galleryUrls: string[];
  description: string;
  features: string[];
  isFeatured?: boolean;
  stockQuantity: number;
  warrantyYears: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'pending' | 'contacted' | 'shipping' | 'completed' | 'cancelled';
export type PaymentMethod = 'cod' | 'bank_transfer';
export type OrderType = 'retail' | 'project_quote';

export interface OrderItem {
  productId: string;
  productName: string;
  powerWatt: number;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  customerNote?: string;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  totalAmount: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
}

export interface FilterState {
  category: string;
  powerRange: string;
  priceSort: 'default' | 'asc' | 'desc';
  searchQuery: string;
}

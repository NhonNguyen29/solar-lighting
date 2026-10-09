import { Product, Order, OrderStatus } from '@/types';
import { INITIAL_PRODUCTS } from '@/data/products';

const PRODUCTS_KEY = 'solar_light_products_v1';
const ORDERS_KEY = 'solar_light_orders_v1';

export function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS;
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PRODUCTS;
  }
}

export function saveProduct(product: Product): void {
  if (typeof window === 'undefined') return;
  const products = getStoredProducts();
  const index = products.findIndex((p) => p.id === product.id);
  if (index >= 0) {
    products[index] = product;
  } else {
    products.unshift(product);
  }
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function deleteProduct(productId: string): void {
  if (typeof window === 'undefined') return;
  const products = getStoredProducts().filter((p) => p.id !== productId);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function getStoredOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) {
      // Dữ liệu mẫu ban đầu để Admin có thể xem và kiểm thử đổi trạng thái
      const initialOrders: Order[] = [
        {
          id: 'ord-001',
          orderCode: 'SL-202610-001',
          customerName: 'Nguyễn Văn Hùng',
          customerPhone: '0912345678',
          shippingAddress: 'Thôn 3, Xã Tân Lập, Huyện Đan Phượng, Hà Nội',
          customerNote: 'Cần tư vấn thêm cần đèn bắt tường cho đèn 300W',
          orderType: 'retail',
          paymentMethod: 'cod',
          totalAmount: 2500000,
          status: 'pending',
          items: [
            {
              productId: 'prod-001',
              productName: 'Đèn Đường Năng Lượng Mặt Trời Liền Thể Solar Street 300W',
              powerWatt: 300,
              unitPrice: 1250000,
              quantity: 2
            }
          ],
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
        },
        {
          id: 'ord-002',
          orderCode: 'SL-202610-002',
          customerName: 'Trần Thị Mai',
          customerPhone: '0987654321',
          shippingAddress: 'Số 45 Đường Trần Phú, Phường 4, TP. Vũng Tàu',
          customerNote: 'Giao hàng giờ hành chính',
          orderType: 'retail',
          paymentMethod: 'cod',
          totalAmount: 1890000,
          status: 'contacted',
          items: [
            {
              productId: 'prod-002',
              productName: 'Đèn Pha Năng Lượng Mặt Trời Siêu Sáng Solar Flood 500W Cao Cấp',
              powerWatt: 500,
              unitPrice: 1890000,
              quantity: 1
            }
          ],
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
        }
      ];
      localStorage.setItem(ORDERS_KEY, JSON.stringify(initialOrders));
      return initialOrders;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveNewOrder(order: Order): void {
  if (typeof window === 'undefined') return;
  const orders = getStoredOrders();
  orders.unshift(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function updateOrderStatus(orderId: string, newStatus: OrderStatus): void {
  if (typeof window === 'undefined') return;
  const orders = getStoredOrders();
  const index = orders.findIndex((o) => o.id === orderId);
  if (index >= 0) {
    orders[index].status = newStatus;
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }
}

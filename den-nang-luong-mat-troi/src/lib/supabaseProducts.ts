import { createClient } from '@/utils/supabase/client';
import { Product, ProductCategory } from '@/types';
import { INITIAL_PRODUCTS, CATEGORIES } from '@/data/products';

export interface CategoryData {
  id: string;
  name: string;
  description?: string;
  display_order?: number;
  count?: number;
}

// Chuyển đổi dữ liệu từ cột database (snake_case) sang interface Product (camelCase)
export function mapSupabaseProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: (row.category_id || row.category || 'street') as ProductCategory,
    categoryName: row.category_name || 'Đèn Năng Lượng Mặt Trời',
    powerWatt: Number(row.power_watt ?? 0),
    price: Number(row.price ?? 0),
    originalPrice: row.original_price ? Number(row.original_price) : Number(row.price ?? 0),
    batteryCapacity: row.battery_capacity || '',
    solarPanel: row.solar_panel || '',
    ipRating: row.ip_rating || 'IP67',
    lightingTime: row.lighting_time || '12 - 16 giờ',
    lightingArea: row.lighting_area || '',
    ledChip: row.led_chip || '',
    imageUrl: row.image_url || '',
    galleryUrls: Array.isArray(row.gallery_urls) && row.gallery_urls.length > 0 
      ? row.gallery_urls 
      : (row.image_url ? [row.image_url] : []),
    description: row.description || '',
    features: Array.isArray(row.features) ? row.features : [],
    isFeatured: Boolean(row.is_featured),
    stockQuantity: Number(row.stock_quantity ?? 50),
    warrantyYears: Number(row.warranty_years ?? 3),
  };
}

// Lấy danh sách sản phẩm trực tiếp từ kho Supabase
export async function getProductsFromSupabase(): Promise<Product[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('power_watt', { ascending: true });

    if (error) {
      console.error('Lỗi khi tải sản phẩm từ Supabase:', error.message);
      return INITIAL_PRODUCTS;
    }

    if (!data || data.length === 0) {
      return INITIAL_PRODUCTS;
    }

    return data.map(mapSupabaseProduct);
  } catch (err) {
    console.error('Ngoại lệ khi kết nối Supabase:', err);
    return INITIAL_PRODUCTS;
  }
}

// Lấy danh sách danh mục từ Supabase
export async function getCategoriesFromSupabase(): Promise<CategoryData[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return CATEGORIES;
    }

    return [
      { id: 'all', name: 'Tất Cả Sản Phẩm' },
      ...data.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        display_order: c.display_order,
      })),
    ];
  } catch (err) {
    console.error('Lỗi khi tải danh mục từ Supabase:', err);
    return CATEGORIES;
  }
}

export interface CreateOrderParams {
  orderCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  customerNote?: string;
  orderType: 'retail' | 'project_quote';
  paymentMethod: 'cod' | 'bank_transfer';
  totalAmount: number;
  items: {
    productId: string;
    productName: string;
    powerWatt: number;
    unitPrice: number;
    quantity: number;
  }[];
}

// Ghi nhận đơn đặt hàng trực tiếp vào kho Supabase (cả bảng orders và order_items)
export async function createOrderInSupabase(
  params: CreateOrderParams
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    const supabase = createClient();

    // Chuẩn bị chuỗi tóm tắt món cho Table Editor đọc ngay
    const itemsSummary = params.items
      .map((i) => `${i.quantity}x ${i.productName} (${i.powerWatt}W)`)
      .join('; ');

    const itemsDetail = params.items.map((i) => ({
      product_id: i.productId,
      product_name: i.productName,
      power_watt: i.powerWatt,
      unit_price: i.unitPrice,
      quantity: i.quantity,
      subtotal: i.unitPrice * i.quantity,
    }));

    // 1. Thêm vào bảng public.orders
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_code: params.orderCode,
        customer_name: params.customerName,
        customer_phone: params.customerPhone,
        customer_email: params.customerEmail || null,
        shipping_address: params.shippingAddress,
        customer_note: params.customerNote || null,
        order_type: params.orderType,
        payment_method: params.paymentMethod,
        total_amount: params.totalAmount,
        status: 'pending',
        items_summary: itemsSummary,
        items_detail: itemsDetail,
      })
      .select('id')
      .single();

    if (orderError) {
      console.error('Lỗi Supabase orders:', orderError.message);
      return { success: false, error: orderError.message };
    }

    const orderId = orderData?.id;

    // 2. Thêm vào bảng chi tiết public.order_items
    if (orderId && params.items.length > 0) {
      const orderItemsRows = params.items.map((i) => ({
        order_id: orderId,
        product_id: i.productId,
        product_name: i.productName,
        power_watt: i.powerWatt,
        unit_price: i.unitPrice,
        quantity: i.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsRows);

      if (itemsError) {
        console.warn('Lỗi ghi order_items:', itemsError.message);
      }
    }

    return { success: true, orderId };
  } catch (err: any) {
    console.error('Lỗi ngoại lệ tạo đơn trên Supabase:', err);
    return { success: false, error: err?.message || 'Lỗi không xác định' };
  }
}

// Lấy danh sách đơn hàng thực tế từ kho Supabase
export async function getOrdersFromSupabase(): Promise<any[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.error('Lỗi khi lấy đơn hàng từ Supabase:', error?.message);
      return [];
    }

    return data.map((o) => ({
      id: o.id,
      orderCode: o.order_code,
      customerName: o.customer_name,
      customerPhone: o.customer_phone,
      customerEmail: o.customer_email || undefined,
      shippingAddress: o.shipping_address,
      customerNote: o.customer_note || undefined,
      orderType: o.order_type,
      paymentMethod: o.payment_method,
      totalAmount: Number(o.total_amount),
      status: o.status,
      items: Array.isArray(o.items_detail)
        ? o.items_detail.map((i: any) => ({
            productId: i.product_id,
            productName: i.product_name,
            powerWatt: i.power_watt,
            unitPrice: Number(i.unit_price),
            quantity: Number(i.quantity),
          }))
        : [],
      createdAt: o.created_at,
    }));
  } catch (err) {
    console.error('Lỗi ngoại lệ lấy đơn hàng từ Supabase:', err);
    return [];
  }
}

// Cập nhật trạng thái đơn hàng trên Supabase
export async function updateOrderStatusInSupabase(
  orderId: string,
  newStatus: string
): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error) {
      console.error('Lỗi cập nhật trạng thái đơn hàng trên Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Lỗi ngoại lệ cập nhật đơn hàng trên Supabase:', err);
    return false;
  }
}

// Thêm sản phẩm mới vào Supabase
export async function addProductToSupabase(
  product: Product
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from('products').insert({
      id: product.id,
      name: product.name,
      slug: product.slug,
      category_id: product.category,
      category_name: product.categoryName,
      power_watt: product.powerWatt,
      price: product.price,
      original_price: product.originalPrice || product.price,
      battery_capacity: product.batteryCapacity,
      solar_panel: product.solarPanel,
      ip_rating: product.ipRating || 'IP67',
      lighting_time: product.lightingTime || '12 - 16 giờ',
      lighting_area: product.lightingArea || '150 - 200 m²',
      led_chip: product.ledChip || 'SMD Siêu Sáng',
      image_url: product.imageUrl,
      gallery_urls: product.galleryUrls && product.galleryUrls.length > 0 ? product.galleryUrls : [product.imageUrl],
      description: product.description,
      features: product.features || [],
      is_featured: Boolean(product.isFeatured),
      stock_quantity: Number(product.stockQuantity ?? 50),
      warranty_years: Number(product.warrantyYears ?? 3),
    });

    if (error) {
      console.error('Lỗi khi thêm sản phẩm vào Supabase:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Ngoại lệ thêm sản phẩm:', err);
    return { success: false, error: err?.message || 'Lỗi thêm sản phẩm' };
  }
}

// Cập nhật sản phẩm trên Supabase
export async function updateProductInSupabase(
  productId: string,
  updates: Partial<Product>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const payload: any = {
      updated_at: new Date().toISOString(),
    };
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.slug !== undefined) payload.slug = updates.slug;
    if (updates.category !== undefined) {
      payload.category_id = updates.category;
      payload.category_name = updates.categoryName;
    }
    if (updates.powerWatt !== undefined) payload.power_watt = updates.powerWatt;
    if (updates.price !== undefined) payload.price = updates.price;
    if (updates.originalPrice !== undefined) payload.original_price = updates.originalPrice;
    if (updates.batteryCapacity !== undefined) payload.battery_capacity = updates.batteryCapacity;
    if (updates.solarPanel !== undefined) payload.solar_panel = updates.solarPanel;
    if (updates.ipRating !== undefined) payload.ip_rating = updates.ipRating;
    if (updates.lightingTime !== undefined) payload.lighting_time = updates.lightingTime;
    if (updates.lightingArea !== undefined) payload.lighting_area = updates.lightingArea;
    if (updates.ledChip !== undefined) payload.led_chip = updates.ledChip;
    if (updates.imageUrl !== undefined) {
      payload.image_url = updates.imageUrl;
      payload.gallery_urls = [updates.imageUrl];
    }
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.features !== undefined) payload.features = updates.features;
    if (updates.isFeatured !== undefined) payload.is_featured = updates.isFeatured;
    if (updates.stockQuantity !== undefined) payload.stock_quantity = updates.stockQuantity;
    if (updates.warrantyYears !== undefined) payload.warranty_years = updates.warrantyYears;

    const { error } = await supabase.from('products').update(payload).eq('id', productId);
    if (error) {
      console.error('Lỗi khi sửa sản phẩm trên Supabase:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Ngoại lệ sửa sản phẩm:', err);
    return { success: false, error: err?.message || 'Lỗi cập nhật' };
  }
}

// Xóa sản phẩm khỏi Supabase
export async function deleteProductFromSupabase(
  productId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) {
      console.error('Lỗi khi xóa sản phẩm trên Supabase:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Ngoại lệ xóa sản phẩm:', err);
    return { success: false, error: err?.message || 'Lỗi xóa sản phẩm' };
  }
}


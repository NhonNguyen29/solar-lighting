'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  getStoredOrders, 
  getStoredProducts, 
  updateOrderStatus, 
  saveProduct, 
  deleteProduct 
} from '@/lib/storage';
import { Order, Product, OrderStatus, ProductCategory } from '@/types';
import { 
  ShoppingBag, 
  Package, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Sun, 
  PhoneCall, 
  MapPin, 
  User, 
  X,
  TrendingUp,
  Search
} from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // Form thêm sản phẩm mới
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<ProductCategory>('street');
  const [newProdWatt, setNewProdWatt] = useState(300);
  const [newProdPrice, setNewProdPrice] = useState(1500000);
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState(1900000);
  const [newProdBattery, setNewProdBattery] = useState('30.000mAh LiFePO4');
  const [newProdPanel, setNewProdPanel] = useState('Mono 6V/35W');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80');
  const [newProdDesc, setNewProdDesc] = useState('');

  const loadData = () => {
    setOrders(getStoredOrders());
    setProducts(getStoredProducts());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    loadData();
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: newProdName.trim(),
      slug: newProdName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: newProdCategory,
      categoryName: 
        newProdCategory === 'street' ? 'Đèn Đường' :
        newProdCategory === 'flood' ? 'Đèn Pha' :
        newProdCategory === 'garden' ? 'Đèn Sân Vườn' : 'Đèn Trong Nhà',
      powerWatt: Number(newProdWatt),
      price: Number(newProdPrice),
      originalPrice: Number(newProdOriginalPrice),
      batteryCapacity: newProdBattery.trim(),
      solarPanel: newProdPanel.trim(),
      ipRating: 'IP67 Chống Nước',
      lightingTime: '12 - 16 giờ',
      lightingArea: '150 - 250 m²',
      ledChip: 'SMD 5730 Siêu Sáng',
      imageUrl: newProdImage.trim(),
      galleryUrls: [newProdImage.trim()],
      description: newProdDesc.trim() || 'Mẫu đèn năng lượng mặt trời công suất cao thế hệ mới.',
      features: ['Tự động bật tắt cảm biến ánh sáng', 'Pin LiFePO4 chống chai pin', 'Bảo hành chính hãng'],
      stockQuantity: 50,
      warrantyYears: 3,
    };

    saveProduct(newProd);
    loadData();
    setIsAddProductOpen(false);
    // Reset form
    setNewProdName('');
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi hệ thống?')) {
      deleteProduct(productId);
      loadData();
    }
  };

  const formatVnd = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num) + ' ₫';
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.totalAmount : 0), 0);
  const pendingCount = orders.filter((o) => o.status === 'pending').length;

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'all') return true;
    return o.status === orderStatusFilter;
  });

  return (
    <div className="min-h-screen bg-[#091113] text-slate-200">
      {/* Top Admin Navigation */}
      <header className="border-b border-[#26434b] bg-[#0d1618] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-xl bg-[#1c3137] hover:bg-[#26434b] text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-bold transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Về Cửa Hàng
            </Link>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white font-['Outfit']">
                  Hệ Thống Quản Trị Cửa Hàng (Admin Portal)
                </h1>
                <p className="text-[11px] text-slate-400">
                  SOLAR LIGHT — Quản lý đơn hàng & sản phẩm trực tiếp
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'orders'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-[#1c3137] text-slate-300 hover:text-white'
              }`}
            >
              Quản Lý Đơn Hàng ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'products'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-[#1c3137] text-slate-300 hover:text-white'
              }`}
            >
              Quản Lý Sản Phẩm ({products.length})
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-[#132226] border border-[#26434b]">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Đơn Hàng Mới</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-3xl font-black text-amber-400 font-['Outfit'] block">
              {pendingCount}
            </span>
            <span className="text-[11px] text-slate-400">Cần liên hệ gọi điện tư vấn</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#132226] border border-[#26434b]">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Tổng Số Đơn</span>
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-3xl font-black text-white font-['Outfit'] block">
              {orders.length}
            </span>
            <span className="text-[11px] text-slate-400">Đơn hàng trong cơ sở dữ liệu</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#132226] border border-[#26434b]">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Tổng Doanh Thu</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-['Outfit'] block truncate">
              {formatVnd(totalRevenue)}
            </span>
            <span className="text-[11px] text-slate-400">Ước tính từ các đơn đặt hàng</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#132226] border border-[#26434b]">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Sản Phẩm Trong Kho</span>
              <Package className="w-4 h-4 text-sky-400" />
            </div>
            <span className="text-3xl font-black text-sky-400 font-['Outfit'] block">
              {products.length}
            </span>
            <span className="text-[11px] text-slate-400">Các mẫu đèn đang trưng bày</span>
          </div>
        </div>

        {/* TAB 1: QUẢN LÝ ĐƠN HÀNG */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#132226] border border-[#26434b]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white font-['Outfit']">
                  Danh Sách Đơn Đặt Hàng & Tư Vấn
                </h2>
              </div>

              {/* Status Filter */}
              <div className="flex flex-wrap gap-1.5 text-xs">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'pending', label: 'Mới tiếp nhận' },
                  { id: 'contacted', label: 'Đã liên hệ' },
                  { id: 'shipping', label: 'Đang giao' },
                  { id: 'completed', label: 'Hoàn thành' },
                  { id: 'cancelled', label: 'Đã hủy' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setOrderStatusFilter(st.id)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                      orderStatusFilter === st.id
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-[#1c3137] text-slate-400 hover:text-white'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#132226] border border-[#26434b] text-slate-400 text-xs">
                Chưa có đơn hàng nào trong mục này.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 rounded-2xl bg-[#132226] border border-[#26434b] space-y-4 hover:border-slate-500 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#26434b]/60">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-amber-400 font-['Outfit']">
                          #{order.orderCode}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(order.createdAt).toLocaleString('vi-VN')}
                        </span>
                      </div>

                      {/* Status Selector Dropdown */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Trạng thái:</span>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value as OrderStatus)
                          }
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                            order.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : order.status === 'contacted'
                              ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                              : order.status === 'shipping'
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                              : order.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          }`}
                        >
                          <option value="pending" className="bg-[#132226] text-white">Mới tiếp nhận (Chờ gọi)</option>
                          <option value="contacted" className="bg-[#132226] text-white">Đã gọi xác nhận</option>
                          <option value="shipping" className="bg-[#132226] text-white">Đang giao hàng (COD)</option>
                          <option value="completed" className="bg-[#132226] text-white">Hoàn thành (Đã thanh toán)</option>
                          <option value="cancelled" className="bg-[#132226] text-white">Hủy đơn</option>
                        </select>
                      </div>
                    </div>

                    {/* Customer & Address Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block mb-0.5">Khách hàng:</span>
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-emerald-400" />
                          {order.customerName}
                        </span>
                        <span className="text-emerald-400 font-semibold flex items-center gap-1.5 mt-1">
                          <PhoneCall className="w-3.5 h-3.5" />
                          {order.customerPhone}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block mb-0.5">Địa chỉ giao nhận:</span>
                        <span className="text-slate-200 flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          {order.shippingAddress}
                        </span>
                        {order.customerNote && (
                          <p className="text-[11px] text-amber-300/80 mt-1 italic">
                            Ghi chú: {order.customerNote}
                          </p>
                        )}
                      </div>

                      <div className="text-left md:text-right">
                        <span className="text-slate-400 block mb-0.5">Tổng thanh toán:</span>
                        <span className="text-lg font-black text-amber-400 font-['Outfit'] block">
                          {formatVnd(order.totalAmount)}
                        </span>
                        <span className="text-[10px] text-emerald-400 uppercase font-bold">
                          {order.paymentMethod === 'cod' ? 'Thanh toán COD' : 'Chuyển khoản'}
                        </span>
                      </div>
                    </div>

                    {/* Order Items list */}
                    <div className="pt-2 border-t border-[#26434b]/40 text-xs">
                      <span className="text-[11px] text-slate-400 block mb-1">Chi tiết đèn trong đơn:</span>
                      <div className="space-y-1">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-slate-300 bg-[#1c3137]/60 px-3 py-1.5 rounded-lg">
                            <span>
                              <strong>{it.quantity}x</strong> {it.productName} ({it.powerWatt}W)
                            </span>
                            <span className="font-mono text-amber-400">
                              {formatVnd(it.unitPrice * it.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: QUẢN LÝ SẢN PHẨM */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#132226] border border-[#26434b]">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white font-['Outfit']">
                  Danh Mục Sản Phẩm Đèn Solar
                </h2>
              </div>
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" /> Thêm Mẫu Đèn Mới
              </button>
            </div>

            {/* Products Grid in Admin */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="p-4 rounded-2xl bg-[#132226] border border-[#26434b] space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-full h-36 object-cover rounded-xl bg-slate-900 border border-[#26434b]"
                    />
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-amber-400 font-bold">{prod.powerWatt}W</span>
                      <span className="text-emerald-400 font-semibold">{prod.categoryName}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white line-clamp-2">
                      {prod.name}
                    </h4>
                    <span className="text-sm font-black text-amber-400 font-['Outfit'] block">
                      {formatVnd(prod.price)}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#26434b] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">Kho: {prod.stockQuantity}</span>
                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="text-rose-400 hover:text-rose-300 p-1 flex items-center gap-1 text-[11px]"
                      title="Xóa mẫu đèn"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal Thêm Mẫu Đèn Mới */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#0f1a1d] border border-[#26434b] shadow-2xl p-6 sm:p-8 space-y-6 text-slate-200">
            <div className="flex items-center justify-between border-b border-[#26434b] pb-4">
              <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" /> Thêm Mẫu Đèn Mới Vào Hệ Thống
              </h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="p-1.5 rounded-lg bg-[#1c3137] text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">Tên Đèn Chi Tiết: *</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="Ví dụ: Đèn Đường Năng Lượng Mặt Trời 400W Cao Cấp"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c3137] border border-[#26434b] text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Phân Loại: *</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as ProductCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c3137] border border-[#26434b] text-white"
                  >
                    <option value="street">Đèn Đường</option>
                    <option value="flood">Đèn Pha</option>
                    <option value="garden">Đèn Sân Vườn</option>
                    <option value="indoor">Đèn Trong Nhà</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Công Suất (Watt): *</label>
                  <input
                    type="number"
                    required
                    value={newProdWatt}
                    onChange={(e) => setNewProdWatt(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c3137] border border-[#26434b] text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Giá Bán Khuyến Mãi (VNĐ): *</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c3137] border border-[#26434b] text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Giá Gốc Niêm Yết (VNĐ):</label>
                  <input
                    type="number"
                    value={newProdOriginalPrice}
                    onChange={(e) => setNewProdOriginalPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c3137] border border-[#26434b] text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Pin Lưu Trữ:</label>
                  <input
                    type="text"
                    value={newProdBattery}
                    onChange={(e) => setNewProdBattery(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c3137] border border-[#26434b] text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Tấm Pin Năng Lượng:</label>
                  <input
                    type="text"
                    value={newProdPanel}
                    onChange={(e) => setNewProdPanel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c3137] border border-[#26434b] text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">URL Hình Ảnh Đại Diện:</label>
                <input
                  type="url"
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c3137] border border-[#26434b] text-white"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Mô Tả Sản Phẩm:</label>
                <textarea
                  rows={2}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c3137] border border-[#26434b] text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#26434b]">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#1c3137] text-slate-300 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Lưu Sản Phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  getProductsFromSupabase, 
  getOrdersFromSupabase, 
  updateOrderStatusInSupabase,
  addProductToSupabase,
  updateProductInSupabase,
  deleteProductFromSupabase
} from '@/lib/supabaseProducts';
import { PRESET_ASSETS } from '@/data/assets';
import { Order, Product, OrderStatus, ProductCategory } from '@/types';
import { 
  ShoppingBag, 
  Package, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Edit3,
  ArrowLeft, 
  Sun, 
  PhoneCall, 
  MapPin, 
  User, 
  X,
  TrendingUp,
  Image as ImageIcon,
  ShieldAlert,
  Loader2,
  RefreshCw
} from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { user, profile, isLoading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal Thêm Mới
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<ProductCategory>('street');
  const [newProdWatt, setNewProdWatt] = useState(300);
  const [newProdPrice, setNewProdPrice] = useState(1500000);
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState(1900000);
  const [newProdBattery, setNewProdBattery] = useState('30.000mAh LiFePO4');
  const [newProdPanel, setNewProdPanel] = useState('Mono 6V/35W');
  const [newProdImage, setNewProdImage] = useState(PRESET_ASSETS[0].url);
  const [newProdDesc, setNewProdDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal Chỉnh Sửa Sản Phẩm
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<ProductCategory>('street');
  const [editWatt, setEditWatt] = useState(300);
  const [editPrice, setEditPrice] = useState(1500000);
  const [editOriginalPrice, setEditOriginalPrice] = useState(1900000);
  const [editBattery, setEditBattery] = useState('');
  const [editPanel, setEditPanel] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // Modal Xác Nhận Xóa Sản Phẩm
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // 1. Phân quyền: Kiểm tra nếu chưa đăng nhập hoặc không phải admin thì chuyển hướng về /dang-nhap
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/dang-nhap?redirect=/admin');
      } else if (profile && profile.role !== 'admin') {
        router.push('/dang-nhap?error=unauthorized');
      }
    }
  }, [user, profile, authLoading, router]);

  // 2. Tải dữ liệu thật từ kho Supabase
  const loadData = async () => {
    setIsDataLoading(true);
    try {
      const [supaOrders, supaProducts] = await Promise.all([
        getOrdersFromSupabase(),
        getProductsFromSupabase(),
      ]);
      setOrders(supaOrders);
      setProducts(supaProducts);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu từ Supabase:', err);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      loadData();
    }
  }, [user, profile]);

  // Thông báo tạm thời
  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4000);
  };

  // Đổi trạng thái đơn hàng trên Supabase
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const success = await updateOrderStatusInSupabase(orderId, newStatus);
    if (success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      showFeedback('success', `Đã cập nhật trạng thái đơn sang "${getStatusLabel(newStatus)}" trên Supabase`);
    } else {
      showFeedback('error', 'Không thể cập nhật trạng thái đơn hàng trên Supabase');
    }
  };

  const getStatusLabel = (st: string) => {
    switch (st) {
      case 'pending': return 'Mới tiếp nhận';
      case 'contacted': return 'Đã liên hệ';
      case 'shipping': return 'Đang giao hàng';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return st;
    }
  };

  // Thêm sản phẩm mới vào Supabase
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    setIsSubmitting(true);
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: newProdName.trim(),
      slug: newProdName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
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

    const res = await addProductToSupabase(newProd);
    setIsSubmitting(false);

    if (res.success) {
      showFeedback('success', `Đã thêm sản phẩm "${newProd.name}" thành công vào kho Supabase!`);
      setIsAddProductOpen(false);
      setNewProdName('');
      setNewProdDesc('');
      loadData();
    } else {
      showFeedback('error', `Lỗi khi lưu vào Supabase: ${res.error}`);
    }
  };

  // Mở modal sửa sản phẩm
  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setEditName(prod.name);
    setEditCategory(prod.category);
    setEditWatt(prod.powerWatt);
    setEditPrice(prod.price);
    setEditOriginalPrice(prod.originalPrice || prod.price);
    setEditBattery(prod.batteryCapacity || '');
    setEditPanel(prod.solarPanel || '');
    setEditImage(prod.imageUrl);
    setEditDesc(prod.description || '');
  };

  // Lưu chỉnh sửa sản phẩm lên Supabase
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsSubmitting(true);
    const updates: Partial<Product> = {
      name: editName.trim(),
      slug: editName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      category: editCategory,
      categoryName: 
        editCategory === 'street' ? 'Đèn Đường' :
        editCategory === 'flood' ? 'Đèn Pha' :
        editCategory === 'garden' ? 'Đèn Sân Vườn' : 'Đèn Trong Nhà',
      powerWatt: Number(editWatt),
      price: Number(editPrice),
      originalPrice: Number(editOriginalPrice),
      batteryCapacity: editBattery.trim(),
      solarPanel: editPanel.trim(),
      imageUrl: editImage.trim(),
      galleryUrls: [editImage.trim()],
      description: editDesc.trim(),
    };

    const res = await updateProductInSupabase(editingProduct.id, updates);
    setIsSubmitting(false);

    if (res.success) {
      showFeedback('success', `Đã cập nhật sản phẩm "${updates.name}" trên Supabase!`);
      setEditingProduct(null);
      loadData();
    } else {
      showFeedback('error', `Lỗi cập nhật Supabase: ${res.error}`);
    }
  };

  // Xác nhận xóa sản phẩm khỏi Supabase
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    setIsSubmitting(true);
    const res = await deleteProductFromSupabase(productToDelete.id);
    setIsSubmitting(false);

    if (res.success) {
      showFeedback('success', `Đã xóa sản phẩm "${productToDelete.name}" khỏi Supabase!`);
      setProductToDelete(null);
      loadData();
    } else {
      showFeedback('error', `Lỗi khi xóa trên Supabase: ${res.error}`);
    }
  };

  const formatVnd = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num) + ' ₫';
  };

  // Màn hình loading khi kiểm tra Auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#091113] flex flex-col items-center justify-center text-slate-200">
        <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-300">Đang kiểm tra quyền hạn quản trị viên...</p>
      </div>
    );
  }

  // Màn hình chặn truy cập nếu không phải admin
  if (!user || profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#091113] flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#132226] border border-rose-500/30 shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white font-['Outfit'] mb-2">
              Khu Vực Quản Trị Bị Chặn
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bạn đang đăng nhập bằng tài khoản khách thường hoặc chưa đăng nhập. Chỉ tài khoản có vai <strong className="text-emerald-400">Admin</strong> mới được phép truy cập khu vực này.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/dang-nhap?redirect=/admin"
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all text-center"
            >
              Đăng Nhập Tài Khoản Admin
            </Link>
            <Link
              href="/"
              className="w-full py-3 rounded-xl bg-[#1c3137] hover:bg-[#26434b] text-slate-300 font-bold text-xs transition-all text-center"
            >
              Quay Về Cửa Hàng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.totalAmount : 0), 0);
  const pendingCount = orders.filter((o) => o.status === 'pending').length;

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'all') return true;
    return o.status === orderStatusFilter;
  });

  return (
    <div className="min-h-screen bg-[#091113] text-slate-200">
      {/* Toast Notification */}
      {feedbackMsg && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-xs font-semibold animate-in fade-in slide-in-from-top-4 duration-300 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50'
              : 'bg-rose-950/90 text-rose-200 border-rose-500/50'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Top Admin Navigation */}
      <header className="border-b border-[#26434b] bg-[#0d1618] px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2.5 rounded-xl bg-[#1c3137] hover:bg-[#26434b] text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-bold transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Về Cửa Hàng
            </Link>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-white font-['Outfit']">
                    Hệ Thống Quản Trị Cửa Hàng (Admin Portal)
                  </h1>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                    Kho Supabase Thực
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Đăng nhập: <span className="text-white font-medium">{profile?.email}</span> (Quyền: <span className="text-emerald-400 font-bold uppercase">{profile?.role}</span>)
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={loadData}
              disabled={isDataLoading}
              title="Đồng bộ lại từ Supabase"
              className="p-2.5 rounded-xl bg-[#1c3137] hover:bg-[#26434b] text-slate-300 hover:text-white text-xs font-bold transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isDataLoading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-[#1c3137] text-slate-300 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> Quản Lý Đơn Hàng ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'products'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-[#1c3137] text-slate-300 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" /> Quản Lý Sản Phẩm ({products.length})
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
              <span>Tổng Số Đơn Kho</span>
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-3xl font-black text-white font-['Outfit'] block">
              {orders.length}
            </span>
            <span className="text-[11px] text-slate-400">Đơn hàng trong kho Supabase</span>
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
            <span className="text-[11px] text-slate-400">Các mẫu đèn lưu trữ trên Supabase</span>
          </div>
        </div>

        {/* TAB 1: QUẢN LÝ ĐƠN HÀNG */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#132226] border border-[#26434b]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white font-['Outfit']">
                  Danh Sách Đơn Đặt Hàng & Tư Vấn (Supabase)
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
                        {order.customerEmail && (
                          <span className="text-slate-400 text-[11px] block mt-0.5">
                            {order.customerEmail}
                          </span>
                        )}
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
                        {order.items && order.items.length > 0 ? (
                          order.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between text-slate-300 bg-[#1c3137]/60 px-3 py-1.5 rounded-lg">
                              <span>
                                <strong>{it.quantity}x</strong> {it.productName} ({it.powerWatt}W)
                              </span>
                              <span className="font-mono text-amber-400">
                                {formatVnd(it.unitPrice * it.quantity)}
                              </span>
                            </div>
                          ))
                        ) : (
                          <span className="text-slate-500 italic text-[11px]">Không có thông tin chi tiết món</span>
                        )}
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#132226] border border-[#26434b]">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white font-['Outfit']">
                  Danh Mục Sản Phẩm Đèn Solar (Supabase)
                </h2>
              </div>
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
              >
                <Plus className="w-4 h-4" /> Thêm Mẫu Đèn Mới
              </button>
            </div>

            {/* Products Grid in Admin */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="p-4 rounded-2xl bg-[#132226] border border-[#26434b] space-y-3 flex flex-col justify-between hover:border-slate-500 transition-colors"
                >
                  <div className="space-y-2">
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-full h-40 object-cover rounded-xl bg-slate-900 border border-[#26434b]"
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
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        className="text-sky-400 hover:text-sky-300 p-1 flex items-center gap-1 text-[11px] transition-colors"
                        title="Chỉnh sửa thông tin mẫu đèn"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Sửa
                      </button>
                      <button
                        onClick={() => setProductToDelete(prod)}
                        className="text-rose-400 hover:text-rose-300 p-1 flex items-center gap-1 text-[11px] transition-colors"
                        title="Xóa mẫu đèn"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Xóa
                      </button>
                    </div>
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
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#0f1a1d] border border-[#26434b] shadow-2xl p-6 sm:p-8 space-y-6 text-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-[#26434b] pb-4">
              <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" /> Thêm Mẫu Đèn Mới Vào Kho Supabase
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
                  placeholder="Ví dụ: Đèn Đường Năng Lượng Mặt Trời 500W Cao Cấp"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c3137] border border-[#26434b] text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Phân Loại: *</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as ProductCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c3137] border border-[#26434b] text-white focus:outline-none focus:border-emerald-500"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c3137] border border-[#26434b] text-white focus:outline-none focus:border-emerald-500"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c3137] border border-[#26434b] text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Giá Gốc Niêm Yết (VNĐ):</label>
                  <input
                    type="number"
                    value={newProdOriginalPrice}
                    onChange={(e) => setNewProdOriginalPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c3137] border border-[#26434b] text-white focus:outline-none focus:border-emerald-500"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c3137] border border-[#26434b] text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Tấm Pin Năng Lượng:</label>
                  <input
                    type="text"
                    value={newProdPanel}
                    onChange={(e) => setNewProdPanel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c3137] border border-[#26434b] text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Bộ chọn ảnh từ thư mục Assets có sẵn */}
              <div>
                <label className="font-semibold flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-400" /> Chọn Ảnh Có Sẵn Trong Thư Mục Assets:
                  </span>
                  <span className="text-[10px] text-slate-400">Nhấp chọn ảnh nhanh</span>
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2 p-2 bg-[#132226] rounded-xl border border-[#26434b]">
                  {PRESET_ASSETS.map((asset) => (
                    <div
                      key={asset.id}
                      onClick={() => setNewProdImage(asset.url)}
                      className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all p-1 flex flex-col items-center gap-1 ${
                        newProdImage === asset.url
                          ? 'border-emerald-400 bg-emerald-500/10'
                          : 'border-transparent hover:border-slate-500'
                      }`}
                    >
                      <img src={asset.url} alt={asset.name} className="w-full h-12 object-cover rounded" />
                      <span className="text-[9px] text-slate-300 truncate w-full text-center">{asset.name.split(' ')[1] || asset.name}</span>
                    </div>
                  ))}
                </div>

                <label className="font-semibold block mb-1">Hoặc Nhập URL Hình Ảnh Tùy Chỉnh:</label>
                <input
                  type="url"
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c3137] border border-[#26434b] text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Mô Tả Sản Phẩm:</label>
                <textarea
                  rows={2}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Mô tả thông số hoặc ứng dụng lắp đặt..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c3137] border border-[#26434b] text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#26434b]">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#1c3137] text-slate-300 font-bold hover:bg-[#26434b]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Lưu Vào Supabase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Sửa Mẫu Đèn */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#0f1a1d] border border-[#26434b] shadow-2xl p-6 sm:p-8 space-y-6 text-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-[#26434b] pb-4">
              <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-sky-400" /> Sửa Sản Phẩm: {editingProduct.name}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1.5 rounded-lg bg-[#1c3137] text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">Tên Đèn Chi Tiết: *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c3137] border border-[#26434b] text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Phân Loại: *</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as ProductCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c3137] border border-[#26434b] text-white focus:outline-none focus:border-sky-500"
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
                    value={editWatt}
                    onChange={(e) => setEditWatt(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c3137] border border-[#26434b] text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Giá Bán Khuyến Mãi (VNĐ): *</label>
                  <input
                    type="number"
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c3137] border border-[#26434b] text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Giá Gốc Niêm Yết (VNĐ):</label>
                  <input
                    type="number"
                    value={editOriginalPrice}
                    onChange={(e) => setEditOriginalPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c3137] border border-[#26434b] text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Pin Lưu Trữ:</label>
                  <input
                    type="text"
                    value={editBattery}
                    onChange={(e) => setEditBattery(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c3137] border border-[#26434b] text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Tấm Pin Năng Lượng:</label>
                  <input
                    type="text"
                    value={editPanel}
                    onChange={(e) => setEditPanel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c3137] border border-[#26434b] text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Bộ chọn ảnh từ thư mục Assets có sẵn */}
              <div>
                <label className="font-semibold flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-sky-400" /> Chọn Lại Ảnh Từ Thư Mục Assets Có Sẵn:
                  </span>
                  <span className="text-[10px] text-slate-400">Nhấp chọn ảnh nhanh</span>
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2 p-2 bg-[#132226] rounded-xl border border-[#26434b]">
                  {PRESET_ASSETS.map((asset) => (
                    <div
                      key={asset.id}
                      onClick={() => setEditImage(asset.url)}
                      className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all p-1 flex flex-col items-center gap-1 ${
                        editImage === asset.url
                          ? 'border-sky-400 bg-sky-500/10'
                          : 'border-transparent hover:border-slate-500'
                      }`}
                    >
                      <img src={asset.url} alt={asset.name} className="w-full h-12 object-cover rounded" />
                      <span className="text-[9px] text-slate-300 truncate w-full text-center">{asset.name.split(' ')[1] || asset.name}</span>
                    </div>
                  ))}
                </div>

                <label className="font-semibold block mb-1">Hoặc Sửa URL Hình Ảnh:</label>
                <input
                  type="url"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c3137] border border-[#26434b] text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Mô Tả Sản Phẩm:</label>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c3137] border border-[#26434b] text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#26434b]">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#1c3137] text-slate-300 font-bold hover:bg-[#26434b]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Xác Nhận Xóa Sản Phẩm (Hỏi xác nhận trước khi xóa theo yêu cầu) */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0f1a1d] border border-rose-500/40 shadow-2xl p-6 sm:p-7 space-y-5 text-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Xác Nhận Xóa Sản Phẩm?
              </h3>
              <p className="text-xs text-slate-300">
                Bạn có chắc chắn muốn xóa vĩnh viễn mẫu đèn:
              </p>
              <div className="p-3 bg-[#132226] rounded-xl border border-[#26434b] text-xs font-semibold text-amber-400">
                {productToDelete.name} ({productToDelete.powerWatt}W)
              </div>
              <p className="text-[11px] text-rose-300/80">
                * Hành động này sẽ xóa dòng sản phẩm khỏi cơ sở dữ liệu Supabase và trang khách hàng sẽ không còn hiển thị nữa.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#1c3137] text-slate-300 font-bold text-xs hover:bg-[#26434b] transition-all"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Xác Nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { saveNewOrder } from '@/lib/storage';
import { Order, OrderItem } from '@/types';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  Phone, 
  MapPin, 
  User, 
  FileText,
  AlertCircle
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (orderCode: string) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  onOrderSuccess,
}: CheckoutModalProps) {
  const { items, totalAmount, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [orderType] = useState<'retail' | 'project_quote'>('retail');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer'>('cod');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const formatVnd = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num) + ' ₫';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên người nhận.');
      return;
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Số điện thoại không hợp lệ (tối thiểu 10 chữ số).');
      return;
    }

    if (!shippingAddress.trim()) {
      setErrorMsg('Vui lòng nhập địa chỉ giao hàng cụ thể.');
      return;
    }

    if (items.length === 0) {
      setErrorMsg('Giỏ hàng của bạn đang trống.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Tạo mã đơn hàng duy nhất theo thời gian thực
      const timestamp = Date.now().toString().slice(-4);
      const generatedOrderCode = `SL-${new Date().getFullYear()}${String(
        new Date().getMonth() + 1
      ).padStart(2, '0')}-${timestamp}`;

      const orderItems: OrderItem[] = items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        powerWatt: item.product.powerWatt,
        unitPrice: item.product.price,
        quantity: item.quantity,
      }));

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderCode: generatedOrderCode,
        customerName: customerName.trim(),
        customerPhone: cleanPhone,
        customerEmail: customerEmail.trim() || undefined,
        shippingAddress: shippingAddress.trim(),
        customerNote: customerNote.trim() || undefined,
        orderType,
        paymentMethod,
        totalAmount,
        status: 'pending',
        items: orderItems,
        createdAt: new Date().toISOString(),
      };

      // Lưu đơn hàng vào cơ sở lưu trữ bền vững
      saveNewOrder(newOrder);

      // Xóa giỏ hàng
      clearCart();
      setIsSubmitting(false);
      onClose();
      onOrderSuccess(generatedOrderCode);
    } catch {
      setErrorMsg('Đã có lỗi xảy ra khi lưu đơn hàng. Vui lòng thử lại.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div 
        className="relative w-full max-w-2xl rounded-3xl bg-[#0f1a1d] border border-[#26434b] shadow-2xl overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-[#26434b] flex items-center justify-between bg-[#132226]">
          <div>
            <h2 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-400" />
              Thông Tin Đặt Hàng & Giao Nhận
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Kiểm tra hàng trước khi thanh toán (COD) — Miễn phí vận chuyển toàn quốc
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#1c3137] text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Tóm Tắt Đơn Hàng Ngắn Gọn */}
          <div className="p-4 rounded-2xl bg-[#132226] border border-[#26434b] flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block">Số lượng: <strong>{items.reduce((s, i) => s + i.quantity, 0)} sản phẩm</strong></span>
              <span className="text-emerald-400 font-bold">Miễn phí giao hàng tận nhà</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Tổng thanh toán:</span>
              <span className="text-xl font-black text-amber-400 font-['Outfit']">
                {formatVnd(totalAmount)}
              </span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 text-xs">
            {/* Họ và tên */}
            <div>
              <label className="font-semibold text-slate-300 block mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                Họ và Tên Người Nhận: <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn Hùng"
                className="w-full px-4 py-3 rounded-xl bg-[#1c3137] border border-[#26434b] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Số điện thoại & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-300 block mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  Số Điện Thoại Nhận Hàng: <span className="text-rose-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Ví dụ: 0912345678"
                  className="w-full px-4 py-3 rounded-xl bg-[#1c3137] border border-[#26434b] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Email (Để nhận hóa đơn điện tử):
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="example@gmail.com (tùy chọn)"
                  className="w-full px-4 py-3 rounded-xl bg-[#1c3137] border border-[#26434b] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Địa chỉ giao hàng */}
            <div>
              <label className="font-semibold text-slate-300 block mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                Địa Chỉ Giao Hàng Cụ Thể: <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Số nhà, tên đường, thôn/xã, quận/huyện, tỉnh/thành phố..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#1c3137] border border-[#26434b] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Ghi chú thêm */}
            <div>
              <label className="font-semibold text-slate-300 block mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Ghi Chú Đơn Hàng / Yêu Cầu Lắp Đặt:
              </label>
              <input
                type="text"
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder="Ví dụ: Giao sau 17h, cần tư vấn thêm loại cần đèn gắn cột..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#1c3137] border border-[#26434b] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Phương thức thanh toán */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 block">Phương thức thanh toán:</span>
            <div className="grid grid-cols-2 gap-3">
              <label className="p-3.5 rounded-xl bg-[#132226] border border-emerald-500/50 flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-emerald-400"
                />
                <div>
                  <span className="block text-xs font-bold text-white">Thanh Toán Khi Nhận (COD)</span>
                  <span className="text-[10px] text-slate-400">Kiểm tra sáng đèn mới trả tiền</span>
                </div>
              </label>

              <label className="p-3.5 rounded-xl bg-[#132226] border border-[#26434b] flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'bank_transfer'}
                  onChange={() => setPaymentMethod('bank_transfer')}
                  className="accent-emerald-400"
                />
                <div>
                  <span className="block text-xs font-bold text-white">Chuyển Khoản Ngân Hàng</span>
                  <span className="text-[10px] text-slate-400">Hỗ trợ xuất hóa đơn VAT VAT</span>
                </div>
              </label>
            </div>
          </div>

          {/* Cam kết an toàn */}
          <div className="p-3 rounded-xl bg-[#132226] border border-[#26434b] text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Thông tin đặt hàng của quý khách được bảo mật tuyệt đối theo chính sách riêng tư.</span>
          </div>

          {/* Nút bấm Submit */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-3.5 px-5 rounded-xl bg-[#1c3137] hover:bg-[#26434b] text-slate-300 text-xs font-bold"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black text-xs tracking-wide shadow-lg shadow-emerald-950/60 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Đang xử lý đơn...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Xác Nhận Đặt Hàng ({formatVnd(totalAmount)})</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

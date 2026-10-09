'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck,
  Truck
} from 'lucide-react';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export default function CartDrawer({ onProceedToCheckout }: CartDrawerProps) {
  const { 
    items, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    totalAmount,
    totalItems 
  } = useCart();

  if (!isCartOpen) return null;

  const formatVnd = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num) + ' ₫';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="absolute inset-0" 
        onClick={() => setIsCartOpen(false)} 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0f1a1d] border-l border-[#26434b] text-slate-200 flex flex-col justify-between shadow-2xl">
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#26434b] flex items-center justify-between bg-[#132226]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white font-['Outfit']">
                Giỏ Hàng Của Bạn ({totalItems})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-lg bg-[#1c3137] text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Items Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                <div className="w-20 h-20 rounded-full bg-[#132226] border border-[#26434b] flex items-center justify-center text-slate-500">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Giỏ hàng đang trống</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Hãy lựa chọn các mẫu đèn năng lượng mặt trời công suất cao để nhận ưu đãi miễn phí giao hàng toàn quốc!
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Khám Phá Sản Phẩm Ngay
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="p-4 rounded-2xl bg-[#132226] border border-[#26434b] flex gap-4 items-center"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-18 h-18 rounded-xl object-cover bg-slate-900 border border-[#26434b] shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase">
                      {item.product.powerWatt}W
                    </span>
                    <h4 className="text-xs font-bold text-white truncate">
                      {item.product.name}
                    </h4>
                    <span className="text-xs font-black text-amber-400 block font-['Outfit']">
                      {formatVnd(item.product.price)}
                    </span>

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center rounded-lg bg-[#1c3137] border border-[#26434b] overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-slate-300 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-slate-300 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Total */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#26434b] bg-[#132226] space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Tạm tính ({totalItems} sản phẩm):</span>
                  <span className="font-semibold text-white">{formatVnd(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-emerald-400" /> Vận chuyển toàn quốc:
                  </span>
                  <span className="text-emerald-400 font-bold">MIỄN PHÍ 100%</span>
                </div>
                <div className="pt-2 border-t border-[#26434b] flex justify-between items-baseline text-sm">
                  <span className="font-bold text-white font-['Outfit']">Tổng Thanh Toán:</span>
                  <span className="text-xl font-black text-amber-400 font-['Outfit']">
                    {formatVnd(totalAmount)}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Nhận hàng kiểm tra thử sáng đèn mới thanh toán (COD)</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black text-sm tracking-wide shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Xác Nhận Đặt Hàng Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

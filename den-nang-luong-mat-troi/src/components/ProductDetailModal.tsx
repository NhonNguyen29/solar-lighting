'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { 
  X, 
  ShoppingBag, 
  CheckCircle2, 
  Check
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenOrderForm: (product: Product) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onOpenOrderForm,
}: ProductDetailModalProps) {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const currentImage = selectedImage || product.imageUrl;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const formatVnd = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num) + ' ₫';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div 
        className="relative w-full max-w-4xl rounded-3xl bg-[#0f1a1d] border border-[#26434b] shadow-2xl overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#1c3137]/80 hover:bg-[#26434b] text-slate-400 hover:text-white transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
          {/* Cột Trái: Hình Ảnh Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-[#26434b]">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-xs">
                {product.powerWatt}W CÔNG SUẤT THẬT
              </div>
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-[#0b1315]/80 text-emerald-400 font-bold text-xs border border-emerald-500/30">
                {product.ipRating}
              </div>
            </div>

            {/* Thumbnail selector if multiple images */}
            {product.galleryUrls && product.galleryUrls.length > 1 && (
              <div className="flex gap-2">
                {product.galleryUrls.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(url)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      currentImage === url ? 'border-amber-400 scale-105' : 'border-[#26434b] opacity-70'
                    }`}
                  >
                    <img src={url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Bảng Đặc Tính Nổi Bật */}
            <div className="p-4 rounded-2xl bg-[#132226] border border-[#26434b] space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                Đặc Điểm Nổi Bật:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Cột Phải: Thông Số Kỹ Thuật & Mua Hàng */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  {product.categoryName}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit'] mt-1">
                  {product.name}
                </h2>
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-[#132226] border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Giá khuyến mãi trực tuyến:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-amber-400 font-['Outfit']">
                      {formatVnd(product.price)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-slate-500 line-through">
                        {formatVnd(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                    Tiết kiệm {formatVnd(product.originalPrice - product.price)}
                  </span>
                </div>
              </div>

              {/* Bảng Chi Tiết Thông Số Kỹ Thuật */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Bảng Thông Số Kỹ Thuật Chi Tiết:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#132226] border border-[#26434b]">
                    <span className="text-slate-400 block text-[10px]">Tấm Pin Năng Lượng</span>
                    <span className="font-semibold text-white">{product.solarPanel}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#132226] border border-[#26434b]">
                    <span className="text-slate-400 block text-[10px]">Dung Lượng Pin Lưu</span>
                    <span className="font-semibold text-emerald-400">{product.batteryCapacity}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#132226] border border-[#26434b]">
                    <span className="text-slate-400 block text-[10px]">Thời Gian Chiếu Sáng</span>
                    <span className="font-semibold text-white">{product.lightingTime}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#132226] border border-[#26434b]">
                    <span className="text-slate-400 block text-[10px]">Diện Tích Chiếu Sáng</span>
                    <span className="font-semibold text-white">{product.lightingArea}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#132226] border border-[#26434b]">
                    <span className="text-slate-400 block text-[10px]">Chip LED</span>
                    <span className="font-semibold text-white">{product.ledChip}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#132226] border border-[#26434b]">
                    <span className="text-slate-400 block text-[10px]">Chế Độ Bảo Hành</span>
                    <span className="font-semibold text-amber-400">1 đổi 1 trong {product.warrantyYears} năm</span>
                  </div>
                </div>
              </div>

              {/* Mô Tả Sản Phẩm */}
              <div className="text-xs text-slate-300 leading-relaxed bg-[#132226]/50 p-3.5 rounded-xl border border-[#26434b]/60">
                {product.description}
              </div>
            </div>

            {/* Mua Hàng & Đặt Đơn */}
            <div className="space-y-3 pt-4 border-t border-[#26434b]">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-300">Số lượng:</span>
                <div className="flex items-center rounded-xl bg-[#132226] border border-[#26434b] overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 hover:bg-[#1c3137] text-white font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-bold text-amber-400">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 hover:bg-[#1c3137] text-white font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                    isAdded
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-[#1c3137] hover:bg-[#26434b] text-white border border-emerald-500/40'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Đã Thêm Vào Giỏ</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-emerald-400" />
                      <span>Thêm Vào Giỏ</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    addToCart(product, quantity);
                    onClose();
                    onOpenOrderForm(product);
                  }}
                  className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60"
                >
                  <span>Đặt Mua Ngay (COD)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

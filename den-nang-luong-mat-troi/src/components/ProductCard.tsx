'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { 
  ShoppingBag, 
  BatteryCharging, 
  Droplets, 
  Clock, 
  Check, 
  ShieldCheck,
  Eye
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewDetail: (product: Product) => void;
}

export default function ProductCard({ product, onViewDetail }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const formatVnd = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num) + ' ₫';
  };

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div 
      onClick={() => onViewDetail(product)}
      className="group relative rounded-3xl bg-[#132226] border border-[#26434b] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-950/40 cursor-pointer"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#132226] via-transparent to-black/30 pointer-events-none" />

        {/* Badges on Image */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          <span className="px-2.5 py-1 rounded-lg bg-amber-500 font-extrabold text-[11px] text-slate-950 tracking-wide uppercase shadow-md">
            {product.powerWatt}W
          </span>
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-rose-600 font-bold text-[10px] text-white">
              -{discountPercent}%
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className="px-2 py-1 rounded-md bg-[#0b1315]/80 backdrop-blur-md text-emerald-400 font-bold text-[10px] border border-emerald-500/30 flex items-center gap-1">
            <Droplets className="w-3 h-3" /> {product.ipRating.split(' ')[0]}
          </span>
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
          <span className="px-4 py-2 rounded-xl bg-white/90 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xl">
            <Eye className="w-4 h-4" /> Xem Chi Tiết
          </span>
        </div>
      </div>

      {/* Product Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Category Name */}
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
            {product.categoryName}
          </span>

          {/* Product Title */}
          <h3 className="font-bold text-base text-white line-clamp-2 group-hover:text-amber-300 transition-colors leading-snug font-['Outfit']">
            {product.name}
          </h3>

          {/* Key Spec Chips */}
          <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 truncate">
              <BatteryCharging className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{product.batteryCapacity.split(' ')[0]}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{product.lightingTime.split(' ')[0]} giờ</span>
            </div>
          </div>
        </div>

        {/* Price & Action Section */}
        <div className="pt-3 border-t border-[#26434b]/80 space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-lg font-black text-amber-400 font-['Outfit'] block leading-none">
                {formatVnd(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-500 line-through">
                  {formatVnd(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> BH {product.warrantyYears} Năm
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
              isAdded
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-[#1c3137] hover:bg-emerald-600 text-slate-200 hover:text-white border border-[#26434b] hover:border-emerald-500'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                <span>Đã Thêm Vào Giỏ</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>Thêm Vào Giỏ</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

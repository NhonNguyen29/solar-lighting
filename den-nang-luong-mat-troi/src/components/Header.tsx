'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { 
  Sun, 
  ShoppingBag, 
  PhoneCall, 
  Menu, 
  X, 
  ShieldCheck, 
  Zap, 
  UserCheck
} from 'lucide-react';

interface HeaderProps {
  onOpenCart?: () => void;
}

export default function Header({ onOpenCart }: HeaderProps) {
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCartClick = () => {
    if (onOpenCart) {
      onOpenCart();
    } else {
      setIsCartOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-header">
      {/* Top Bar Cảnh Báo Cam Kết */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#132226] to-amber-950/80 px-4 py-1.5 text-xs text-slate-300 border-b border-[#26434b]/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Bảo Hành 5 Năm Chính Hãng
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-amber-400">
              <Zap className="w-3.5 h-3.5" /> 100% 0 Đồng Tiền Điện Suốt Đời
            </span>
            <span className="hidden md:inline text-slate-400">
              Đổi Mới 1-1 Trong 30 Ngày
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/admin" 
              className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" /> Quản Trị Cửa Hàng
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-emerald-500 p-0.5 glow-solar transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-[#0b1315] rounded-[10px] flex items-center justify-center">
              <Sun className="w-6 h-6 text-amber-400 animate-spin-slow group-hover:rotate-45 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight font-['Outfit'] text-white">
                SOLAR<span className="text-amber-400">LIGHT</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">
              Năng Lượng Sạch Cho Mọi Nhà
            </p>
          </div>
        </Link>

        {/* Desktop Menu Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link href="/" className="hover:text-emerald-400 transition-colors">
            Trang Chủ
          </Link>
          <a href="#products-section" className="hover:text-emerald-400 transition-colors">
            Sản Phẩm Đèn
          </a>
          <a href="#calculator-section" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            Tính Tiết Kiệm Điện
          </a>
          <a href="#features-section" className="hover:text-emerald-400 transition-colors">
            Ưu Điểm & Bảo Hành
          </a>
          <a href="#contact-section" className="hover:text-emerald-400 transition-colors">
            Liên Hệ & Báo Giá
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-4">
          {/* Hotline Quick Call */}
          <a
            href="tel:0988225888"
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1c3137]/80 hover:bg-[#26434b] text-slate-200 border border-[#26434b] transition-all hover:border-emerald-500/40 text-xs font-semibold"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div>
              <span className="block text-[10px] text-slate-400">Tư Vấn Miễn Phí</span>
              <span className="text-emerald-400 font-bold">0988.225.888</span>
            </div>
          </a>

          {/* Cart Button with Count Badge */}
          <button
            onClick={handleCartClick}
            className="relative p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-medium shadow-lg shadow-emerald-950/50 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            aria-label="Giỏ hàng"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden md:inline text-xs font-bold">Giỏ Hàng</span>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-xs font-extrabold flex items-center justify-center shadow-md animate-bounce">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-[#1c3137] text-slate-300 hover:text-white"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#26434b] bg-[#0b1315]/98 px-6 py-6 space-y-4">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-200 hover:text-emerald-400"
          >
            Trang Chủ
          </Link>
          <a
            href="#products-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-200 hover:text-emerald-400"
          >
            Sản Phẩm Đèn Solar
          </a>
          <a
            href="#calculator-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-2"
          >
            <Zap className="w-4 h-4" /> Tính Tiết Kiệm Tiền Điện
          </a>
          <a
            href="#features-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-200 hover:text-emerald-400"
          >
            Ưu Điểm & Chính Sách Bảo Hành
          </a>
          <a
            href="#contact-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-200 hover:text-emerald-400"
          >
            Liên Hệ Showroom
          </a>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-emerald-400 pt-2 border-t border-[#26434b]"
          >
            Quản Trị Hệ Thống (Admin)
          </Link>
          <div className="pt-2">
            <a
              href="tel:0988225888"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm"
            >
              <PhoneCall className="w-4 h-4" /> Gọi Hotline: 0988.225.888
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

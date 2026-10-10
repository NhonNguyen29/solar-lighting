'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { 
  Sun, 
  ShoppingBag, 
  PhoneCall, 
  Menu, 
  X, 
  ShieldCheck, 
  Zap, 
  UserCheck,
  User,
  LogIn,
  LogOut
} from 'lucide-react';

interface HeaderProps {
  onOpenCart?: () => void;
}

export default function Header({ onOpenCart }: HeaderProps) {
  const { totalItems, setIsCartOpen } = useCart();
  const { user, profile, signOut } = useAuth();
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
      {/* Top Bar Cảnh Báo Cam Kết & Auth Bar */}
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

          {/* User Auth Info or Login/Register Links */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2.5">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Xin chào,</span>{' '}
                  <strong className="text-white">{profile?.fullName || user.email?.split('@')[0]}</strong>
                </span>
                <span className="text-slate-600">|</span>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Đăng xuất tài khoản"
                >
                  <LogOut className="w-3 h-3" />
                  <span className="hidden sm:inline">Đăng Xuất</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link 
                  href="/dang-nhap" 
                  className="flex items-center gap-1 text-slate-300 hover:text-emerald-400 font-medium transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-400" /> Đăng Nhập
                </Link>
                <span className="text-slate-600">|</span>
                <Link 
                  href="/dang-ky" 
                  className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
                >
                  Đăng Ký
                </Link>
              </div>
            )}

            <span className="text-slate-600 hidden sm:inline">|</span>
            <Link 
              href="/admin" 
              className={`flex items-center gap-1 transition-all ${
                profile?.role === 'admin' 
                  ? 'text-emerald-400 hover:text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 text-[11px]'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" /> Quản Trị
              {profile?.role === 'admin' && (
                <span className="text-[9px] bg-emerald-500 text-slate-950 font-black px-1 rounded ml-0.5">ADMIN</span>
              )}
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
          <Link href="/san-pham" className="hover:text-emerald-400 transition-colors">
            Sản Phẩm Đèn
          </Link>
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
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Hotline Quick Call */}
          <a
            href="tel:0988225888"
            className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1c3137]/80 hover:bg-[#26434b] text-slate-200 border border-[#26434b] transition-all hover:border-emerald-500/40 text-xs font-semibold"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div>
              <span className="block text-[10px] text-slate-400">Tư Vấn Miễn Phí</span>
              <span className="text-emerald-400 font-bold">0988.225.888</span>
            </div>
          </a>

          {/* User Account Button (Desktop) */}
          {user ? (
            <div className="relative group hidden sm:block">
              <button 
                type="button"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1c3137] hover:bg-[#26434b] border border-[#26434b] text-slate-200 transition-all text-xs font-semibold hover:border-emerald-500/40"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-extrabold flex items-center justify-center text-xs">
                  {(profile?.fullName || user.email || 'U')[0].toUpperCase()}
                </div>
                <span className="text-white max-w-[110px] truncate">
                  {profile?.fullName || user.email?.split('@')[0]}
                </span>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full pt-1.5 w-52 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-50">
                <div className="rounded-2xl bg-[#132226] border border-[#26434b] shadow-2xl p-2 space-y-1">
                  <div className="px-3 py-2 border-b border-[#26434b] mb-1">
                    <p className="text-xs font-bold text-white truncate">{profile?.fullName}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/san-pham"
                    className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-[#1c3137] rounded-xl hover:text-white transition-colors"
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-400" /> Mua sắm đèn
                  </Link>
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-[#1c3137] rounded-xl hover:text-white transition-colors"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> Quản trị cửa hàng
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors text-left font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Đăng Xuất
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/dang-nhap"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1c3137] hover:bg-[#26434b] border border-[#26434b] text-slate-200 text-xs font-semibold hover:border-emerald-500/40 transition-all"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Đăng Nhập</span>
            </Link>
          )}

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
          {/* Mobile Auth Bar */}
          {user ? (
            <div className="p-3.5 rounded-2xl bg-[#132226] border border-[#26434b] space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 font-extrabold text-sm flex items-center justify-center">
                  {(profile?.fullName || user.email || 'U')[0].toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">{profile?.fullName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" /> Đăng Xuất Tài Khoản
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/dang-nhap"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold text-center"
              >
                Đăng Nhập
              </Link>
              <Link
                href="/dang-ky"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 rounded-xl bg-[#1c3137] border border-[#26434b] text-slate-200 text-xs font-bold text-center"
              >
                Đăng Ký
              </Link>
            </div>
          )}

          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-200 hover:text-emerald-400"
          >
            Trang Chủ
          </Link>
          <Link
            href="/san-pham"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-200 hover:text-emerald-400"
          >
            Sản Phẩm Đèn Solar
          </Link>
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

'use client';

import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  BatteryCharging, 
  ArrowRight, 
  CheckCircle2,
  Droplets
} from 'lucide-react';

interface HeroBannerProps {
  onExploreProducts: () => void;
  onOpenCalculator: () => void;
}

export default function HeroBanner({ onExploreProducts, onOpenCalculator }: HeroBannerProps) {
  return (
    <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-b from-[#0e191c] via-[#0b1315] to-[#0b1315]">
      {/* Background Decorative Solar Circles & Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/15 to-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute -top-24 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#132226] border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>CÔNG NGHỆ CHIP LED SMD 5730 THẾ HỆ MỚI 2026</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-['Outfit'] tracking-tight text-white leading-[1.15]">
              CHIẾU SÁNG <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400">0 ĐỒNG</span> TIỀN ĐIỆN
              <span className="block text-2xl sm:text-4xl text-slate-200 mt-2 font-bold">
                Bền Bỉ 10 Năm Cùng Nắng Gió
              </span>
            </h1>

            {/* Description Subtitle */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Giải pháp thắp sáng thông minh không cần kéo dây điện. Tự động sạc năng lượng mặt trời ban ngày, thắp sáng rực rỡ suốt đêm 14–18 giờ liên tục. Chống bão gió ngập nước đạt chuẩn IP67.
            </p>

            {/* 3 Key Highlights Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg mx-auto lg:mx-0">
              <div className="p-3 rounded-xl bg-[#132226]/90 border border-[#26434b] text-center">
                <BatteryCharging className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <span className="block text-xs font-bold text-white">Pin LiFePO4</span>
                <span className="text-[10px] text-slate-400">Chống chai 8 năm</span>
              </div>
              <div className="p-3 rounded-xl bg-[#132226]/90 border border-[#26434b] text-center">
                <Droplets className="w-5 h-5 text-sky-400 mx-auto mb-1" />
                <span className="block text-xs font-bold text-white">Chuẩn IP67</span>
                <span className="text-[10px] text-slate-400">Chống ngâm nước</span>
              </div>
              <div className="p-3 rounded-xl bg-[#132226]/90 border border-[#26434b] text-center">
                <ShieldCheck className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <span className="block text-xs font-bold text-white">5 Năm</span>
                <span className="text-[10px] text-slate-400">Bảo hành 1 đổi 1</span>
              </div>
            </div>

            {/* CTAs Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onExploreProducts}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/60 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group"
              >
                <span>Xem Danh Mục Đèn Solar</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenCalculator}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#1c3137] hover:bg-[#26434b] text-amber-300 font-bold text-sm border border-amber-500/40 transition-all hover:border-amber-400 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Tính Tiền Điện Tiết Kiệm</span>
              </button>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-3xl p-1 bg-gradient-to-b from-amber-500/40 via-emerald-500/30 to-[#132226] glow-solar">
              <div className="relative rounded-[22px] overflow-hidden bg-[#0d1618] p-5 space-y-4">
                {/* Product Hero Image */}
                <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-slate-900 border border-[#26434b]">
                  <img
                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"
                    alt="Đèn năng lượng mặt trời công suất cao"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-600/90 text-white text-xs font-bold shadow">
                    Bán Chạy Nhất #1
                  </div>
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#0b1315]/90 text-amber-400 text-xs font-black border border-amber-500/30">
                    300W SOLAR
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-[#0b1315]/85 backdrop-blur-md border border-[#26434b] flex items-center justify-between text-xs">
                    <div>
                      <span className="block text-slate-400 text-[10px]">Tấm Pin Công Nghệ</span>
                      <span className="font-bold text-white">Mono 6V/35W Hiệu Suất Cao</span>
                    </div>
                    <span className="text-emerald-400 font-bold text-sm">Sạc Nhanh 4H</span>
                  </div>
                </div>

                {/* Live Stats Floating Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#132226] border border-[#26434b]">
                    <span className="block text-2xl font-black text-white font-['Outfit']">50.000+</span>
                    <span className="text-xs text-slate-400">Hộ gia đình tin dùng</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#132226] border border-[#26434b]">
                    <span className="block text-2xl font-black text-amber-400 font-['Outfit']">100%</span>
                    <span className="text-xs text-slate-400">Miễn phí tiền điện</span>
                  </div>
                </div>

                {/* Bottom Trust Stamp */}
                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 border-t border-[#26434b]/60">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Thử sáng mới nhận hàng
                  </span>
                  <span>Kiểm định Quatest 3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import React, { useState } from 'react';
import { 
  Coins, 
  Leaf, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface EcoCalculatorProps {
  onSelectRecommended: (wattage: number) => void;
}

export default function EcoCalculator({ onSelectRecommended }: EcoCalculatorProps) {
  const [lampCount, setLampCount] = useState<number>(4);
  const [wattage, setWattage] = useState<number>(200);
  const [hoursPerNight, setHoursPerNight] = useState<number>(10);

  // Tính toán số liệu
  // Điện tiêu thụ: (bóng * watt * giờ) / 1000 (kWh / ngày)
  const kwhPerDay = (lampCount * wattage * hoursPerNight) / 1000;
  const kwhPerYear = kwhPerDay * 365;
  
  // Giá điện trung bình 3.000 VNĐ/kWh
  const annualSavingsVnd = Math.round(kwhPerYear * 3000);
  const fiveYearSavingsVnd = annualSavingsVnd * 5;
  
  // Giảm thải CO2: ~0.72 kg CO2 trên mỗi kWh nhiệt điện
  const co2ReducedKg = Math.round(kwhPerYear * 0.72);

  const formatVnd = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num) + ' ₫';
  };

  return (
    <section id="calculator-section" className="py-20 bg-[#0d1619] border-y border-[#26434b] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Bảng Tính Lợi Ích Kinh Tế Thực Tế
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-['Outfit']">
            Bạn Tiết Kiệm Bao Nhiêu Tiền Điện Mỗi Năm?
          </h2>
          <p className="text-slate-400 text-sm">
            Kéo chọn nhu cầu thắp sáng hiện tại của gia đình hoặc công trình để tính toán chính xác số tiền bạn sẽ giữ lại trong túi khi chuyển sang dùng đèn năng lượng mặt trời.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Cột Trái: Bộ Điều Khiển Kéo Thả */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#132226] border border-[#26434b] space-y-6 flex flex-col justify-between">
            {/* Thanh trượt 1: Số lượng bóng đèn */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-200">
                  Số lượng bóng đèn cần chiếu sáng:
                </label>
                <span className="text-lg font-black text-amber-400 font-['Outfit'] px-3 py-1 rounded-lg bg-[#1c3137]">
                  {lampCount} bóng
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={lampCount}
                onChange={(e) => setLampCount(Number(e.target.value))}
                className="w-full h-2.5 bg-[#1c3137] rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>1 bóng (Cổng/sân nhỏ)</span>
                <span>10 bóng (Trang trại/Kho)</span>
                <span>20 bóng (Đường quê)</span>
              </div>
            </div>

            {/* Lựa chọn 2: Công suất đèn thay thế */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-200 block">
                Công suất bóng đèn dự kiến (Watt):
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {[100, 200, 300, 500].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setWattage(w)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                      wattage === w
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-950'
                        : 'bg-[#1c3137] text-slate-300 border-[#26434b] hover:border-slate-500'
                    }`}
                  >
                    {w}W
                  </button>
                ))}
              </div>
            </div>

            {/* Thanh trượt 3: Số giờ thắp sáng mỗi đêm */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-200">
                  Thời gian thắp sáng mỗi đêm:
                </label>
                <span className="text-lg font-black text-emerald-400 font-['Outfit'] px-3 py-1 rounded-lg bg-[#1c3137]">
                  {hoursPerNight} giờ / đêm
                </span>
              </div>
              <input
                type="range"
                min="6"
                max="16"
                value={hoursPerNight}
                onChange={(e) => setHoursPerNight(Number(e.target.value))}
                className="w-full h-2.5 bg-[#1c3137] rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>6 giờ (Buổi tối)</span>
                <span>10-12 giờ (Thấu đêm)</span>
                <span>16 giờ (Mùa đông)</span>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Đèn mặt trời tự động bật khi trời tối và tắt sạc pin khi trời sáng</span>
            </div>
          </div>

          {/* Cột Phải: Bảng Kết Quả Tiết Kiệm */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#132226] via-[#111e21] to-[#0e191c] border border-amber-500/30 flex flex-col justify-between glow-solar">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#26434b]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-['Outfit']">Kết Quả Ước Tính</h3>
                    <p className="text-xs text-slate-400">Dựa trên đơn giá điện sinh hoạt 3.000 ₫/kWh</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Lãi Ròng 100%
                </span>
              </div>

              {/* Con số tiết kiệm chính */}
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Tiết kiệm tiền điện mỗi năm:
                </span>
                <div className="text-3xl sm:text-5xl font-black text-amber-400 font-['Outfit'] tracking-tight">
                  {formatVnd(annualSavingsVnd)}
                </div>
              </div>

              {/* Thống kê phụ: 5 năm & CO2 */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#0b1315]/80 border border-[#26434b]">
                  <span className="text-[11px] text-slate-400 block font-medium">Sau 5 năm bảo hành:</span>
                  <span className="text-xl sm:text-2xl font-bold text-emerald-400 font-['Outfit']">
                    {formatVnd(fiveYearSavingsVnd)}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-0.5">Đủ tiền mua sắm thêm nhiều tiện ích</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0b1315]/80 border border-[#26434b]">
                  <span className="text-[11px] text-slate-400 block font-medium">Giảm thải khí nhà kính:</span>
                  <span className="text-xl sm:text-2xl font-bold text-sky-400 font-['Outfit'] flex items-center gap-1">
                    <Leaf className="w-4 h-4 text-emerald-400" />
                    {co2ReducedKg.toLocaleString('vi-VN')} kg
                  </span>
                  <p className="text-[10px] text-slate-500 mt-0.5">Tương đương trồng ~30 cây xanh</p>
                </div>
              </div>
            </div>

            {/* Nút Kêu Gọi Hành Động */}
            <div className="pt-6">
              <button
                type="button"
                onClick={() => onSelectRecommended(wattage)}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-950/60 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>Xem Ngay Các Dòng Đèn {wattage}W Phù Hợp</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

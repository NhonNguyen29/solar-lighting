'use client';

import { PhoneCall, ShieldCheck, PackageCheck } from 'lucide-react';

interface OrderSuccessModalProps {
  orderCode: string | null;
  onClose: () => void;
}

export default function OrderSuccessModal({
  orderCode,
  onClose,
}: OrderSuccessModalProps) {
  if (!orderCode) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-[#0f1a1d] border border-emerald-500/40 p-8 text-center space-y-6 shadow-2xl glow-emerald"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated Checkmark Circle */}
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30 animate-bounce">
          <PackageCheck className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Đặt Hàng Thành Công!
          </span>
          <h2 className="text-2xl font-black text-white font-['Outfit']">
            Cảm Ơn Quý Khách Đã Lựa Chọn SOLAR LIGHT
          </h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            Đơn hàng của bạn đã được tiếp nhận và lưu vào hệ thống. Chuyên viên kỹ thuật sẽ liên hệ qua điện thoại trong vòng <strong>15 phút</strong> để xác nhận và điều phối giao hàng.
          </p>
        </div>

        {/* Order Code Box */}
        <div className="p-4 rounded-2xl bg-[#132226] border border-[#26434b] text-center space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider">
            Mã Đơn Hàng Của Bạn:
          </span>
          <div className="text-2xl font-black text-amber-400 font-['Outfit'] tracking-wider">
            #{orderCode}
          </div>
          <span className="text-[10px] text-slate-500">
            (Vui lòng lưu lại mã này để tra cứu trạng thái giao hàng)
          </span>
        </div>

        {/* 3 Guarantees */}
        <div className="grid grid-cols-2 gap-3 text-left text-xs bg-[#132226]/60 p-4 rounded-xl border border-[#26434b]/60">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="text-slate-300">Bảo hành 1 đổi 1 tận nhà</span>
          </div>
          <div className="flex items-start gap-2">
            <PhoneCall className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span className="text-slate-300">Hotline hỗ trợ 24/7</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-950/60"
        >
          Tiếp Tục Khám Phá Sản Phẩm Khác
        </button>
      </div>
    </div>
  );
}

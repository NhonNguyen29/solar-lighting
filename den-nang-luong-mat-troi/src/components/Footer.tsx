'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sun, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Award,
  CheckCircle2
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#080e10] border-t border-[#26434b] text-slate-400 text-sm">
      {/* Cam Kết Vàng 4 Trụ Cột */}
      <div className="border-b border-[#26434b]/60 py-10 bg-[#0e171a]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#132226]/80 border border-[#26434b]">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Bảo Hành 2 - 5 Năm</h4>
                <p className="text-xs text-slate-400 mt-0.5">Cam kết bảo hành chính hãng toàn quốc</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#132226]/80 border border-[#26434b]">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">1 Đổi 1 Trong 30 Ngày</h4>
                <p className="text-xs text-slate-400 mt-0.5">Lỗi kỹ thuật đổi mới ngay không chờ đợi</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#132226]/80 border border-[#26434b]">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Giao Hàng Miễn Phí</h4>
                <p className="text-xs text-slate-400 mt-0.5">Kiểm tra sáng đèn mới thanh toán COD</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#132226]/80 border border-[#26434b]">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Đầy Đủ CO/CQ Dự Án</h4>
                <p className="text-xs text-slate-400 mt-0.5">Hồ sơ chứng chỉ Quatest 3, CE, RoHS</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div id="contact-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Cột 1 & 2: Thông Tin Công Ty */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-emerald-500 p-0.5 glow-solar">
                <div className="w-full h-full bg-[#0b1315] rounded-[10px] flex items-center justify-center">
                  <Sun className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <span className="text-2xl font-black font-['Outfit'] text-white">
                SOLAR<span className="text-amber-400">LIGHT</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              Đơn vị tiên phong nhập khẩu và phân phối giải pháp chiếu sáng năng lượng mặt trời công nghệ cao tại Việt Nam. Đem lại nguồn ánh sáng bền bỉ, an toàn, tiết kiệm 100% tiền điện cho mọi nếp nhà và công trình giao thông.
            </p>
            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Showroom Hà Nội: Số 88 Đường Cầu Giấy, P. Quan Hoa, Q. Cầu Giấy</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Showroom TP.HCM: Số 245 Đường Cộng Hòa, Phường 13, Q. Tân Bình</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-white font-semibold">Hotline: 0988.225.888 / 0912.345.678</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Email: contact@solarlight.vn</span>
              </div>
            </div>
          </div>

          {/* Cột 3: Danh Mục Sản Phẩm */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4 font-['Outfit']">
              Danh Mục Đèn Solar
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/san-pham" className="hover:text-emerald-400 transition-colors">
                  Đèn Đường Liền Thể 300W - 500W
                </Link>
              </li>
              <li>
                <Link href="/san-pham" className="hover:text-emerald-400 transition-colors">
                  Đèn Đường Tấm Pin Rời Công Trình
                </Link>
              </li>
              <li>
                <Link href="/san-pham" className="hover:text-emerald-400 transition-colors">
                  Đèn Pha Sân Bãi & Biển Hiệu 200W - 500W
                </Link>
              </li>
              <li>
                <Link href="/san-pham" className="hover:text-emerald-400 transition-colors">
                  Đèn Trụ Cổng Biệt Thự & Tường Rào
                </Link>
              </li>
              <li>
                <Link href="/san-pham" className="hover:text-emerald-400 transition-colors">
                  Đèn Cắm Cỏ Sân Vườn Resort
                </Link>
              </li>
              <li>
                <Link href="/san-pham" className="hover:text-emerald-400 transition-colors">
                  Đèn Ốp Trần Trong Nhà Dân Dụng
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Hỗ Trợ & Chính Sách */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4 font-['Outfit']">
              Chính Sách & Dịch Vụ
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Hướng Dẫn Tự Lắp Đặt Tại Nhà
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Báo Giá Dự Án Đèn Đường Quê
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Tra Cứu Bảo Hành Điện Tử
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Chính Sách Đại Lý & Sỉ Chiết Khấu
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Đổi Trả Miễn Phí Trong 30 Ngày
              </li>
            </ul>
          </div>

          {/* Cột 5: Giờ Làm Việc & Đăng Ký */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4 font-['Outfit']">
              Giờ Hoạt Động Showroom
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Thứ 2 – Chủ Nhật: 08:00 – 21:00 (Kể cả ngày lễ, Tết). Kỹ thuật viên sẵn sàng hỗ trợ trực tiếp 24/7.
            </p>
            <div className="p-3.5 rounded-xl bg-[#132226] border border-[#26434b] text-xs">
              <span className="block text-emerald-400 font-bold mb-1">Cần Khảo Sát Tận Nơi?</span>
              <p className="text-[11px] text-slate-400">
                Liên hệ hotline để được kỹ sư mang mẫu đèn đến thử nghiệm độ sáng thực tế tại công trình của bạn.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-8 border-t border-[#26434b]/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 SOLAR LIGHT VIỆT NAM. Bản quyền thuộc về thương hiệu SOLAR LIGHT.</p>
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-slate-400 hover:text-emerald-400 transition-colors">
              Hệ Thống Quản Trị
            </Link>
            <span>Tiêu Chuẩn ISO 9001:2015</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

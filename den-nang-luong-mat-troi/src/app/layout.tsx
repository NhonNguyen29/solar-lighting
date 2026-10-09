import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  title: 'SOLAR LIGHT — Cửa Hàng & Catalogue Đèn Năng Lượng Mặt Trời',
  description: 'Chuyên cung cấp đèn đường, đèn pha, đèn sân vườn năng lượng mặt trời công suất cao từ 60W đến 1000W. 0 đồng tiền điện, sáng thấu đêm, bảo hành chính hãng 5 năm.',
  keywords: 'đèn năng lượng mặt trời, đèn đường solar, đèn pha năng lượng mặt trời, đèn sân vườn, đèn liền thể, pin lifepo4',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className="min-h-screen bg-[#0b1315] text-[#f8fafc] antialiased selection:bg-emerald-500 selection:text-white">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}

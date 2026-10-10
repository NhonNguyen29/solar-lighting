'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroBanner from '@/components/HeroBanner';
import EcoCalculator from '@/components/EcoCalculator';
import ProductCard from '@/components/ProductCard';
import ProductFilter from '@/components/ProductFilter';
import ProductDetailModal from '@/components/ProductDetailModal';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import OrderSuccessModal from '@/components/OrderSuccessModal';
import { getProductsFromSupabase, getCategoriesFromSupabase, CategoryData } from '@/lib/supabaseProducts';
import { Product, FilterState } from '@/types';
import { 
  Sun, 
  ShieldCheck, 
  BatteryCharging, 
  Droplets, 
  Award,
  SearchX,
  Loader2
} from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterState>({
    category: 'all',
    powerRange: 'all',
    priceSort: 'default',
    searchQuery: '',
  });

  // Tải dữ liệu thời gian thực từ Supabase
  useEffect(() => {
    let isMounted = true;
    async function fetchStoreData() {
      try {
        const [supabaseProducts, supabaseCategories] = await Promise.all([
          getProductsFromSupabase(),
          getCategoriesFromSupabase(),
        ]);
        if (isMounted) {
          setProducts(supabaseProducts);
          setCategories(supabaseCategories);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Lỗi kết nối Supabase:', err);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchStoreData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Modal States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [successOrderCode, setSuccessOrderCode] = useState<string | null>(null);

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Lọc danh mục
        if (filter.category !== 'all' && p.category !== filter.category) {
          return false;
        }

        // Lọc công suất
        if (filter.powerRange !== 'all') {
          if (filter.powerRange === 'under-100' && p.powerWatt >= 100) return false;
          if (filter.powerRange === '100-200' && (p.powerWatt < 100 || p.powerWatt > 200)) return false;
          if (filter.powerRange === '300' && p.powerWatt !== 300) return false;
          if (filter.powerRange === '500' && p.powerWatt !== 500) return false;
          if (filter.powerRange === '1000' && p.powerWatt !== 1000) return false;
        }

        // Lọc tìm kiếm
        if (filter.searchQuery.trim()) {
          const q = filter.searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchWatt = p.powerWatt.toString().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          if (!matchName && !matchWatt && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filter.priceSort === 'asc') return a.price - b.price;
        if (filter.priceSort === 'desc') return b.price - a.price;
        return 0;
      });
  }, [products, filter]);

  const handleFilterChange = (newFilter: Partial<FilterState>) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  };

  const handleResetFilter = () => {
    setFilter({
      category: 'all',
      powerRange: 'all',
      priceSort: 'default',
      searchQuery: '',
    });
  };

  const handleSelectRecommendedFromCalc = (watt: number) => {
    setFilter((prev) => ({
      ...prev,
      powerRange: watt.toString(),
      category: 'all',
    }));
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b1315]">
      {/* 1. Header Navigation */}
      <Header />

      {/* 2. Hero Banner */}
      <HeroBanner
        onExploreProducts={() => {
          const el = document.getElementById('products-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenCalculator={() => {
          const el = document.getElementById('calculator-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 3. Eco Calculator Widget */}
      <EcoCalculator onSelectRecommended={handleSelectRecommendedFromCalc} />

      {/* 4. Products & Catalog Section */}
      <section id="products-section" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
            <Sun className="w-3.5 h-3.5" /> Catalogue Sản Phẩm Chính Hãng
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-['Outfit']">
            Bộ Sưu Tập Đèn Năng Lượng Mặt Trời 2026
          </h2>
          <p className="text-slate-400 text-sm">
            Công suất thực chuẩn kiểm định. Đầy đủ các dòng đèn đường, đèn pha, đèn sân vườn và đèn trong nhà đáp ứng mọi nhu cầu thắp sáng.
          </p>
        </div>

        {/* Filter Toolbar */}
        <ProductFilter
          filter={filter}
          onChangeFilter={handleFilterChange}
          onReset={handleResetFilter}
          totalResults={filteredProducts.length}
          categories={categories}
        />

        {/* Products Grid */}
        {isLoading ? (
          /* Loading State */
          <div className="py-24 text-center space-y-4">
            <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
            <p className="text-sm text-slate-400">Đang tải sản phẩm từ kho Supabase...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty State */
          <div className="p-16 rounded-3xl bg-[#132226] border border-[#26434b] text-center space-y-4 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#1c3137] text-slate-500 mx-auto flex items-center justify-center">
              <SearchX className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Không tìm thấy sản phẩm phù hợp</h3>
              <p className="text-xs text-slate-400 mt-1">
                Không có mẫu đèn nào khớp với tiêu chí lọc hiện tại của bạn. Vui lòng thử lại với từ khóa khác hoặc xóa bộ lọc.
              </p>
            </div>
            <button
              onClick={handleResetFilter}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              Xem Tất Cả Sản Phẩm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetail={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 5. Features & Technological Superiority */}
      <section id="features-section" className="py-20 bg-[#0e171a] border-t border-[#26434b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" /> Vì Sao Chọn SOLAR LIGHT?
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-['Outfit']">
              Công Nghệ Vượt Trội Cho Độ Bền Bỉ 10 Năm
            </h2>
            <p className="text-slate-400 text-sm">
              Khác biệt hoàn toàn với các dòng đèn trôi nổi giá rẻ sử dụng pin cũ và vỏ nhựa dễ giòn gãy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#132226] border border-[#26434b] space-y-4 hover:border-emerald-500/40 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <BatteryCharging className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white font-['Outfit']">
                Pin Lithium LiFePO4 Mới 100%
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sử dụng dòng pin sắt phốt phát LiFePO4 chu kỳ nạp xả hơn 2.500 lần (tương đương 8-10 năm). Hệ thống quản lý pin thông minh BMS chống cháy nổ và ngăn chặn tình trạng phồng chai pin.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#132226] border border-[#26434b] space-y-4 hover:border-sky-500/40 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/15 text-sky-400 flex items-center justify-center">
                <Droplets className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white font-['Outfit']">
                Kháng Nước IP67 — Chống Bão Cấp 12
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Thân đèn đúc từ hợp kim nhôm nguyên khối có rãnh tản nhiệt dày dặn. Zoăng cao su silicon kép ngăn nước mưa và bụi cát tuyệt đối, an tâm hoạt động trong điều kiện mưa bão nhiệt đới.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#132226] border border-[#26434b] space-y-4 hover:border-amber-500/40 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white font-['Outfit']">
                Bảo Hành 1 Đổi 1 Trong 5 Năm
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Chính sách bảo hành rõ ràng, tem bảo hành điện tử chính hãng. Trong 30 ngày đầu nếu phát sinh lỗi kỹ thuật được đổi mới ngay lập tức không mất phí.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <Footer />

      {/* 7. Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenOrderForm={() => {
          setSelectedProduct(null);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 8. Slide-over Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => {
          setIsCheckoutOpen(true);
        }}
      />

      {/* 9. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={(code) => setSuccessOrderCode(code)}
      />

      {/* 10. Order Success Notification Modal */}
      <OrderSuccessModal
        orderCode={successOrderCode}
        onClose={() => setSuccessOrderCode(null)}
      />
    </div>
  );
}

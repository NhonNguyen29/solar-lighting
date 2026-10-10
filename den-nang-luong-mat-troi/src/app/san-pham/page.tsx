'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
  SearchX, 
  Loader2, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Home as HomeIcon, 
  ChevronRight 
} from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterState>({
    category: 'all',
    powerRange: 'all',
    priceSort: 'default',
    searchQuery: '',
  });

  // Modal States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [successOrderCode, setSuccessOrderCode] = useState<string | null>(null);

  // Tải danh sách sản phẩm thời gian thực từ Supabase
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
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
        console.error('Lỗi khi tải danh sách sản phẩm từ Supabase:', err);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Lọc sản phẩm
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

  return (
    <div className="min-h-screen flex flex-col bg-[#0b1315]">
      {/* 1. Header Navigation */}
      <Header />

      {/* 2. Breadcrumb & Page Hero */}
      <section className="bg-gradient-to-b from-[#101c20] to-[#0b1315] border-b border-[#26434b]/60 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-emerald-400 flex items-center gap-1 transition-colors">
              <HomeIcon className="w-3.5 h-3.5" /> Trang Chủ
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-emerald-400 font-medium">Danh Sách Sản Phẩm</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-2">
                <Sun className="w-3.5 h-3.5" /> Dữ Liệu Thời Gian Thực
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-['Outfit']">
                Danh Sách Sản Phẩm Đèn Solar
              </h1>
              <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                Tất cả các dòng đèn năng lượng mặt trời chính hãng đang có sẵn trong kho: Đèn đường liền thể, đèn pha công trình, đèn sân vườn và đèn trong nhà.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-4 text-xs text-slate-300 bg-[#132226] px-4 py-2.5 rounded-2xl border border-[#26434b]">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> Bảo hành 3-5 năm
              </div>
              <div className="w-px h-4 bg-[#26434b]" />
              <div className="flex items-center gap-1.5 text-amber-400">
                <Zap className="w-4 h-4" /> Tiết kiệm 100% điện
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Catalog Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 space-y-10">
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
          <div className="py-24 text-center space-y-4">
            <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
            <p className="text-sm text-slate-400">Đang đồng bộ danh mục đèn từ kho Supabase...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
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
      </main>

      {/* 4. Footer */}
      <Footer />

      {/* 5. Modals */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenOrderForm={() => {
          setSelectedProduct(null);
          setIsCheckoutOpen(true);
        }}
      />

      <CartDrawer
        onProceedToCheckout={() => {
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={(code) => setSuccessOrderCode(code)}
      />

      <OrderSuccessModal
        orderCode={successOrderCode}
        onClose={() => setSuccessOrderCode(null)}
      />
    </div>
  );
}

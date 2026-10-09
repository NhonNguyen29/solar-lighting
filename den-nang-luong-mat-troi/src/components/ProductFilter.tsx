'use client';

import React from 'react';
import { CATEGORIES, POWER_OPTIONS } from '@/data/products';
import { FilterState } from '@/types';
import { Search, X, ArrowUpDown } from 'lucide-react';

interface ProductFilterProps {
  filter: FilterState;
  onChangeFilter: (newFilter: Partial<FilterState>) => void;
  onReset: () => void;
  totalResults: number;
}

export default function ProductFilter({
  filter,
  onChangeFilter,
  onReset,
  totalResults,
}: ProductFilterProps) {
  return (
    <div className="space-y-6 p-6 rounded-3xl bg-[#132226] border border-[#26434b]">
      {/* Top Search Input & Result Count */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-4 border-b border-[#26434b]">
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filter.searchQuery}
            onChange={(e) => onChangeFilter({ searchQuery: e.target.value })}
            placeholder="Tìm theo tên đèn, công suất (300w, 500w)..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#1c3137] border border-[#26434b] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
          {filter.searchQuery && (
            <button
              onClick={() => onChangeFilter({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right Sort & Reset */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <span className="text-xs text-slate-400">
            Tìm thấy <strong className="text-emerald-400">{totalResults}</strong> mẫu đèn
          </span>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-xs bg-[#1c3137] px-3 py-1.5 rounded-xl border border-[#26434b]">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filter.priceSort}
              onChange={(e) =>
                onChangeFilter({ priceSort: e.target.value as FilterState['priceSort'] })
              }
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer text-xs"
            >
              <option value="default" className="bg-[#132226]">Sắp xếp: Mặc định</option>
              <option value="asc" className="bg-[#132226]">Giá: Thấp đến Cao</option>
              <option value="desc" className="bg-[#132226]">Giá: Cao đến Thấp</option>
            </select>
          </div>

          {(filter.category !== 'all' ||
            filter.powerRange !== 'all' ||
            filter.searchQuery !== '' ||
            filter.priceSort !== 'default') && (
            <button
              onClick={onReset}
              className="px-3 py-1.5 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-all"
            >
              Xóa Lọc
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Danh Mục Đèn:
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onChangeFilter({ category: cat.id })}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                filter.category === cat.id
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md shadow-emerald-950'
                  : 'bg-[#1c3137] text-slate-300 border-[#26434b] hover:border-slate-500'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Power Wattage Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Công Suất Chiếu Sáng:
        </label>
        <div className="flex flex-wrap gap-2">
          {POWER_OPTIONS.map((pow) => (
            <button
              key={pow.value}
              onClick={() => onChangeFilter({ powerRange: pow.value })}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                filter.powerRange === pow.value
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-950'
                  : 'bg-[#1c3137]/80 text-slate-400 border-[#26434b] hover:text-white hover:border-slate-500'
              }`}
            >
              {pow.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

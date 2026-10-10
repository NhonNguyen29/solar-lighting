-- ====================================================================
-- MIGRATION: BỔ SUNG CỘT CÁC MÓN VÀO BẢNG ORDERS TRÊN SUPABASE
-- DỰ ÁN: SOLAR LIGHTING (ĐÈN NĂNG LƯỢNG MẶT TRỜI)
-- ====================================================================

ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS items_summary TEXT,
ADD COLUMN IF NOT EXISTS items_detail JSONB DEFAULT '[]'::jsonb;

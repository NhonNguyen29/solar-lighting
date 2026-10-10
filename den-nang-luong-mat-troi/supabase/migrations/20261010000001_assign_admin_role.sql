-- ====================================================================
-- MIGRATION: PHÂN VAI NGƯỜI DÙNG & GÁN QUYỀN ADMIN CHO NHONNGUYEN2901@GMAIL.COM
-- ====================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone',
    CASE 
      WHEN lower(NEW.email) = 'nhonnguyen2901@gmail.com' THEN 'admin'
      ELSE COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    role = CASE 
      WHEN lower(EXCLUDED.email) = 'nhonnguyen2901@gmail.com' THEN 'admin'
      ELSE public.profiles.role
    END,
    updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

UPDATE public.profiles SET role = 'admin' WHERE lower(email) = 'nhonnguyen2901@gmail.com';

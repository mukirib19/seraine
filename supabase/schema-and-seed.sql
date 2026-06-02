-- ============================================================
-- STEP 1: CREATE TABLES
-- Run this FIRST in Supabase SQL Editor
-- ============================================================

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  phone text,
  dark_mode boolean DEFAULT false,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sku text UNIQUE,
  description text,
  price numeric NOT NULL DEFAULT 0,
  category text,
  images text[] DEFAULT '{}',
  video_url text,
  in_stock boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Banners table
CREATE TABLE IF NOT EXISTS banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text,
  video_url text,
  link text,
  start_date date,
  end_date date,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Favourites table
CREATE TABLE IF NOT EXISTS favourites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity int NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Quotations table (for contact form)
CREATE TABLE IF NOT EXISTS quotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text,
  customer_email text,
  customer_phone text,
  service_type text,
  brief text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- STEP 2: ENABLE ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE favourites ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- STEP 3: RLS POLICIES
-- ============================================================

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Products: public read, admin write
CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Banners: public read, admin write
CREATE POLICY "Anyone can view banners" ON banners FOR SELECT USING (true);
CREATE POLICY "Admins can manage banners" ON banners FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Favourites: users manage their own
CREATE POLICY "Users manage own favourites" ON favourites FOR ALL USING (auth.uid() = user_id);

-- Cart items: users manage their own
CREATE POLICY "Users manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);

-- Quotations: anyone can insert, admins can read all
CREATE POLICY "Anyone can submit quotation" ON quotations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view quotations" ON quotations FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================
-- STEP 4: AUTO-CREATE PROFILE ON SIGNUP TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- STEP 5: STORAGE BUCKETS
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view product images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images' AND
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can delete product images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images' AND
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================
-- STEP 6: SEED DATA — 7 Products + 3 Banners
-- ============================================================

INSERT INTO products (name, sku, description, price, category, images, in_stock) VALUES

('Custom Vinyl Banner – Large Format',
 'SC-LF001',
 'High-quality vinyl banners printed in full colour. Perfect for events, storefronts, and exhibitions. Available in any custom size.',
 3500, 'Large Format',
 ARRAY['https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80'],
 true),

('Branded A5 Notebook',
 'SC-NB001',
 'Premium soft-cover notebooks with custom branding. 100 pages, lined. Perfect for corporate gifts and events.',
 850, 'Notebooks',
 ARRAY['https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80'],
 true),

('Wedding Invitation Suite',
 'SC-EP001',
 'Elegant wedding invitation sets including the main card, RSVP card, and envelope. Custom design available.',
 4500, 'Event Planning',
 ARRAY['https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&q=80'],
 true),

('Custom Printed T-Shirt',
 'SC-TS001',
 'Premium quality t-shirts with your design printed using DTF technology. Vivid colours that last wash after wash.',
 1200, 'T-Shirt Printing',
 ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
 true),

('Sublimation Branded Mug',
 'SC-MB001',
 'Full-wrap sublimation printed ceramic mugs. Dishwasher safe. Minimum order 10 pieces for bulk pricing.',
 650, 'Mug Branding',
 ARRAY['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80'],
 true),

('Premium Flower Bouquet',
 'SC-BQ001',
 'Beautifully arranged fresh flower bouquets for birthdays, anniversaries, and special occasions.',
 2500, 'Bouquets',
 ARRAY['https://images.unsplash.com/photo-1487530811015-780f4b10e231?w=800&q=80'],
 true),

('Event Backdrop & Decor Setup',
 'SC-ED001',
 'Full event decor setup including custom printed backdrop, table runners, and balloon arrangements.',
 15000, 'Event Decor',
 ARRAY['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80'],
 true);

INSERT INTO banners (title, image_url, link, start_date, end_date, active) VALUES

('Father''s Day Special — 20% Off Custom Mugs',
 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=1200&q=80',
 '/catalog?category=Mug Branding',
 '2025-06-08', '2025-06-16', true),

('Christmas Gifting Collection',
 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=1200&q=80',
 '/catalog', '2025-12-01', '2025-12-26', true),

('Valentine''s Day — Gifts That Say It All',
 'https://images.unsplash.com/photo-1487530811015-780f4b10e231?w=1200&q=80',
 '/catalog?category=Bouquets',
 '2025-02-07', '2025-02-15', true);

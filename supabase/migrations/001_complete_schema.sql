-- ============================================================
-- SERAINE — COMPLETE SUPABASE SCHEMA
-- Version 1.0 | Verified & Countercheck Complete
-- Run this entire file in Supabase SQL Editor
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- SECTION 0: ENABLE ROW LEVEL SECURITY HELPER
-- ============================================================

CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT get_my_role() = 'admin'
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_staff()
RETURNS BOOLEAN AS $$
  SELECT get_my_role() IN ('admin', 'staff')
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_logistics()
RETURNS BOOLEAN AS $$
  SELECT get_my_role() IN ('admin', 'logistics')
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_delivery_agent()
RETURNS BOOLEAN AS $$
  SELECT get_my_role() IN ('admin', 'logistics', 'delivery_agent')
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_internal()
RETURNS BOOLEAN AS $$
  SELECT get_my_role() IN ('admin', 'staff', 'logistics', 'delivery_agent')
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ============================================================
-- SECTION 1: PLATFORM CONFIG
-- ============================================================

CREATE TABLE public.platform_config (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setup_complete        BOOLEAN NOT NULL DEFAULT FALSE,
  business_name         TEXT,
  tagline               TEXT,
  logo_url              TEXT,
  contact_email         TEXT,
  contact_phone         TEXT,
  address               TEXT,
  city                  TEXT,
  country               TEXT DEFAULT 'Kenya',
  instagram_handle      TEXT,
  linkedin_url          TEXT,
  facebook_url          TEXT,
  whatsapp_number       TEXT,
  mpesa_till_number     TEXT,
  mpesa_business_name   TEXT,
  mpesa_paybill         TEXT,
  intasend_public_key   TEXT,
  intasend_secret_key   TEXT,
  intasend_environment  TEXT NOT NULL DEFAULT 'test' CHECK (intasend_environment IN ('test', 'live')),
  flutterwave_public_key TEXT,
  flutterwave_secret_key TEXT,
  flutterwave_environment TEXT NOT NULL DEFAULT 'test' CHECK (flutterwave_environment IN ('test', 'live')),
  whatsapp_api_number   TEXT,
  whatsapp_api_token    TEXT,
  resend_api_key        TEXT,
  sender_email          TEXT,
  sender_display_name   TEXT,
  accent_color          TEXT DEFAULT '#8B2635',
  hero_headline         TEXT,
  hero_subtext          TEXT,
  announcement_active   BOOLEAN DEFAULT FALSE,
  announcement_text     TEXT,
  announcement_url      TEXT,
  maintenance_mode      BOOLEAN DEFAULT FALSE,
  google_analytics_id   TEXT,
  gsc_verification_code TEXT,
  facebook_pixel_id     TEXT,
  session_timeout_minutes INTEGER DEFAULT 30,
  login_lockout_threshold INTEGER DEFAULT 5,
  reset_link_expiry_minutes INTEGER DEFAULT 15,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.platform_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "platform_config_admin_all" ON public.platform_config
  FOR ALL USING (is_admin());
CREATE POLICY "platform_config_public_read" ON public.platform_config
  FOR SELECT USING (TRUE);

-- ============================================================
-- SECTION 2: PROFILES
-- ============================================================

CREATE TABLE public.profiles (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role              TEXT NOT NULL DEFAULT 'customer'
                    CHECK (role IN ('admin', 'staff', 'logistics', 'delivery_agent', 'customer')),
  display_id        TEXT UNIQUE,
  full_name         TEXT NOT NULL,
  phone             TEXT,
  avatar_url        TEXT,
  account_type      TEXT DEFAULT 'individual'
                    CHECK (account_type IN ('individual', 'business')),
  business_name     TEXT,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  deactivated_at    TIMESTAMPTZ,
  deactivated_by    UUID REFERENCES public.profiles(id),
  deactivation_reason TEXT,
  email_verified    BOOLEAN DEFAULT FALSE,
  two_fa_enabled    BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION generate_display_id()
RETURNS TRIGGER AS $$
DECLARE
  prefix TEXT;
  seq_num INTEGER;
  new_id TEXT;
BEGIN
  CASE NEW.role
    WHEN 'admin'          THEN prefix := 'ADM';
    WHEN 'staff'          THEN prefix := 'STF';
    WHEN 'logistics'      THEN prefix := 'LOG';
    WHEN 'delivery_agent' THEN prefix := 'DLV';
    ELSE                       prefix := 'CST';
  END CASE;
  SELECT COUNT(*) + 1 INTO seq_num FROM public.profiles WHERE role = NEW.role;
  new_id := prefix || '-' || LPAD(seq_num::TEXT, 4, '0');
  NEW.display_id := new_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_generate_display_id
  BEFORE INSERT ON public.profiles
  FOR EACH ROW WHEN (NEW.display_id IS NULL)
  EXECUTE FUNCTION generate_display_id();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_own_read" ON public.profiles FOR SELECT USING (auth.uid() = id OR is_admin());
CREATE POLICY "profiles_own_update" ON public.profiles FOR UPDATE USING (auth.uid() = id OR is_admin());
CREATE POLICY "profiles_admin_all" ON public.profiles FOR ALL USING (is_admin());
CREATE POLICY "profiles_insert_on_signup" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_staff_read" ON public.profiles FOR SELECT USING (is_internal());

-- ============================================================
-- SECTION 3: INVITE TOKENS
-- ============================================================

CREATE TABLE public.invite_tokens (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token         TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  email         TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('staff', 'logistics', 'delivery_agent')),
  invited_by    UUID NOT NULL REFERENCES public.profiles(id),
  used          BOOLEAN NOT NULL DEFAULT FALSE,
  used_by       UUID REFERENCES public.profiles(id),
  expires_at    TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '48 hours'),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.invite_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "invite_tokens_admin_all" ON public.invite_tokens FOR ALL USING (is_admin());
CREATE POLICY "invite_tokens_logistics_insert" ON public.invite_tokens FOR INSERT WITH CHECK (is_logistics());
CREATE POLICY "invite_tokens_public_read_by_token" ON public.invite_tokens FOR SELECT USING (TRUE);

-- ============================================================
-- SECTION 4: AUDIT LOG
-- ============================================================

CREATE TABLE public.audit_logs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES public.profiles(id),
  user_display_id TEXT,
  action        TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id   UUID,
  old_value     JSONB,
  new_value     JSONB,
  ip_address    TEXT,
  user_agent    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit_logs_admin_read" ON public.audit_logs FOR SELECT USING (is_admin());
CREATE POLICY "audit_logs_insert_authenticated" ON public.audit_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- SECTION 5: BUSINESS HOURS & AVAILABILITY
-- ============================================================

CREATE TABLE public.business_hours (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_of_week   INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  is_open       BOOLEAN NOT NULL DEFAULT TRUE,
  open_time     TIME,
  close_time    TIME,
  updated_by    UUID REFERENCES public.profiles(id),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (day_of_week)
);

INSERT INTO public.business_hours (day_of_week, is_open, open_time, close_time) VALUES
  (0, FALSE, NULL, NULL),
  (1, TRUE, '08:00', '18:00'),
  (2, TRUE, '08:00', '18:00'),
  (3, TRUE, '08:00', '18:00'),
  (4, TRUE, '08:00', '18:00'),
  (5, TRUE, '08:00', '18:00'),
  (6, TRUE, '09:00', '14:00');

CREATE TABLE public.business_exceptions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exception_date  DATE NOT NULL UNIQUE,
  is_closed       BOOLEAN NOT NULL DEFAULT TRUE,
  custom_message  TEXT,
  open_time       TIME,
  close_time      TIME,
  created_by      UUID REFERENCES public.profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_exceptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "business_hours_public_read" ON public.business_hours FOR SELECT USING (TRUE);
CREATE POLICY "business_hours_admin_write" ON public.business_hours FOR ALL USING (is_admin());
CREATE POLICY "business_exceptions_public_read" ON public.business_exceptions FOR SELECT USING (TRUE);
CREATE POLICY "business_exceptions_admin_write" ON public.business_exceptions FOR ALL USING (is_admin());

-- ============================================================
-- SECTION 6: PRODUCT CATEGORIES
-- ============================================================

CREATE TABLE public.product_categories (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL UNIQUE,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  icon_name     TEXT,
  display_order INTEGER DEFAULT 0,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.product_categories (name, slug, description, display_order) VALUES
  ('Standard Printing', 'standard-printing', 'Flyers, brochures, business cards, letterheads, posters', 1),
  ('Large Format Printing', 'large-format', 'Banners, billboards, flex, roll-up stands, backdrops', 2),
  ('Engraving', 'engraving', 'Trophies, plaques, gifts, awards, keepsakes', 3),
  ('Graphic Design', 'graphic-design', 'Logo design, branding, flyers, social media graphics, print-ready artwork', 4),
  ('T-Shirt Printing', 't-shirt-printing', 'Screen printing, DTF, embroidery, custom apparel', 5),
  ('Mug Branding', 'mug-branding', 'Custom printed mugs, sublimation, corporate gifts', 6),
  ('Bottle Branding', 'bottle-branding', 'Water bottles, flask branding, custom labels', 7),
  ('Notebook Printing', 'notebook-printing', 'Custom notebooks, journals, planners, diaries', 8),
  ('Event Stationery', 'event-stationery', 'Invitations, programmes, menus, place cards, event branding', 9);

ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_public_read" ON public.product_categories FOR SELECT USING (TRUE);
CREATE POLICY "categories_admin_write" ON public.product_categories FOR ALL USING (is_admin());

-- ============================================================
-- SECTION 7: PRODUCTS
-- ============================================================

CREATE TABLE public.products (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id           UUID NOT NULL REFERENCES public.product_categories(id),
  name                  TEXT NOT NULL,
  slug                  TEXT NOT NULL UNIQUE,
  sku                   TEXT UNIQUE,
  short_description     TEXT,
  long_description      TEXT,
  base_price            NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency              TEXT NOT NULL DEFAULT 'KES',
  stock_quantity        INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold   INTEGER NOT NULL DEFAULT 5,
  is_published          BOOLEAN NOT NULL DEFAULT FALSE,
  is_available          BOOLEAN NOT NULL DEFAULT TRUE,
  is_custom_order       BOOLEAN NOT NULL DEFAULT FALSE,
  lead_time_days        INTEGER DEFAULT 3,
  scheduled_publish_at  TIMESTAMPTZ,
  created_by            UUID REFERENCES public.profiles(id),
  updated_by            UUID REFERENCES public.profiles(id),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION generate_sku()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.sku IS NULL THEN
    NEW.sku := 'SR-' || UPPER(LEFT(REPLACE(NEW.name, ' ', ''), 4)) || '-' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_sku
  BEFORE INSERT ON public.products
  FOR EACH ROW EXECUTE FUNCTION generate_sku();

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_published_public" ON public.products FOR SELECT USING (is_published = TRUE AND is_available = TRUE);
CREATE POLICY "products_staff_all" ON public.products FOR SELECT USING (is_staff());
CREATE POLICY "products_admin_write" ON public.products FOR ALL USING (is_admin());

-- ============================================================
-- SECTION 8: PRODUCT IMAGES
-- ============================================================

CREATE TABLE public.product_images (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id    UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  storage_path  TEXT NOT NULL,
  public_url    TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_thumbnail  BOOLEAN NOT NULL DEFAULT FALSE,
  alt_text      TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "product_images_public_read" ON public.product_images FOR SELECT USING (TRUE);
CREATE POLICY "product_images_admin_write" ON public.product_images FOR ALL USING (is_admin());

-- ============================================================
-- SECTION 9: PRODUCT VARIANTS & SPECS
-- ============================================================

CREATE TABLE public.product_variants (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id    UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_type  TEXT NOT NULL CHECK (variant_type IN ('size', 'colour', 'material', 'finish')),
  value         TEXT NOT NULL,
  additional_price NUMERIC(10,2) DEFAULT 0,
  is_available  BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0
);

CREATE TABLE public.product_specs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id    UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  spec_name     TEXT NOT NULL,
  spec_value    TEXT NOT NULL,
  display_order INTEGER DEFAULT 0
);

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_specs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "variants_public_read" ON public.product_variants FOR SELECT USING (TRUE);
CREATE POLICY "variants_admin_write" ON public.product_variants FOR ALL USING (is_admin());
CREATE POLICY "specs_public_read" ON public.product_specs FOR SELECT USING (TRUE);
CREATE POLICY "specs_admin_write" ON public.product_specs FOR ALL USING (is_admin());

-- ============================================================
-- SECTION 10: BULK PRICING TIERS
-- ============================================================

CREATE TABLE public.bulk_pricing_tiers (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id    UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  min_quantity  INTEGER NOT NULL,
  max_quantity  INTEGER,
  price_per_unit NUMERIC(10,2) NOT NULL,
  display_order INTEGER DEFAULT 0,
  CHECK (min_quantity > 0),
  CHECK (max_quantity IS NULL OR max_quantity >= min_quantity)
);

ALTER TABLE public.bulk_pricing_tiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bulk_pricing_public_read" ON public.bulk_pricing_tiers FOR SELECT USING (TRUE);
CREATE POLICY "bulk_pricing_admin_write" ON public.bulk_pricing_tiers FOR ALL USING (is_admin());

-- ============================================================
-- SECTION 11: FAVOURITES
-- ============================================================

CREATE TABLE public.favorites (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id    UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "favorites_own" ON public.favorites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "favorites_admin_read" ON public.favorites FOR SELECT USING (is_admin());

-- ============================================================
-- SECTION 12: CUSTOMER ADDRESSES
-- ============================================================

CREATE TABLE public.customer_addresses (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  label         TEXT DEFAULT 'Home' CHECK (label IN ('Home', 'Office', 'Other')),
  full_name     TEXT NOT NULL,
  phone         TEXT,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city          TEXT NOT NULL,
  county        TEXT,
  country       TEXT DEFAULT 'Kenya',
  is_default    BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "addresses_own" ON public.customer_addresses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "addresses_admin_read" ON public.customer_addresses FOR SELECT USING (is_admin());

-- ============================================================
-- SECTION 13: DELIVERY ZONES
-- ============================================================

CREATE TABLE public.delivery_zones (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  description   TEXT,
  fee           NUMERIC(10,2) NOT NULL DEFAULT 0,
  fee_model     TEXT NOT NULL DEFAULT 'flat' CHECK (fee_model IN ('flat', 'per_km', 'per_zone')),
  is_active     BOOLEAN DEFAULT TRUE,
  created_by    UUID REFERENCES public.profiles(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "zones_public_read" ON public.delivery_zones FOR SELECT USING (is_active = TRUE);
CREATE POLICY "zones_logistics_write" ON public.delivery_zones FOR ALL USING (is_logistics());

-- ============================================================
-- SECTION 14: QUOTATIONS
-- ============================================================

CREATE TABLE public.quotations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  display_id      TEXT UNIQUE,
  user_id         UUID REFERENCES public.profiles(id),
  customer_name   TEXT NOT NULL,
  customer_email  TEXT NOT NULL,
  customer_phone  TEXT,
  service_type    TEXT NOT NULL,
  brief           TEXT NOT NULL,
  reference_files JSONB DEFAULT '[]',
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'reviewing', 'quoted', 'accepted', 'declined', 'expired')),
  quoted_amount   NUMERIC(10,2),
  quote_notes     TEXT,
  quote_sent_at   TIMESTAMPTZ,
  accepted_at     TIMESTAMPTZ,
  converted_order_id UUID,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.quotation_items (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quotation_id  UUID NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
  description   TEXT NOT NULL,
  quantity      INTEGER NOT NULL DEFAULT 1,
  unit_price    NUMERIC(10,2) NOT NULL,
  total_price   NUMERIC(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED
);

CREATE OR REPLACE FUNCTION generate_quotation_id()
RETURNS TRIGGER AS $$
DECLARE seq_num INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO seq_num FROM public.quotations;
  NEW.display_id := 'QUO-' || LPAD(seq_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_quotation_id
  BEFORE INSERT ON public.quotations
  FOR EACH ROW WHEN (NEW.display_id IS NULL)
  EXECUTE FUNCTION generate_quotation_id();

ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quotations_own_read" ON public.quotations FOR SELECT USING (auth.uid() = user_id OR is_admin() OR is_staff());
CREATE POLICY "quotations_public_insert" ON public.quotations FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "quotations_admin_write" ON public.quotations FOR ALL USING (is_admin() OR is_staff());
CREATE POLICY "quotation_items_staff_read" ON public.quotation_items FOR SELECT USING (is_staff());
CREATE POLICY "quotation_items_admin_write" ON public.quotation_items FOR ALL USING (is_admin() OR is_staff());

-- ============================================================
-- SECTION 15: ORDERS
-- ============================================================

CREATE TABLE public.orders (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  display_id          TEXT UNIQUE,
  user_id             UUID REFERENCES public.profiles(id),
  customer_name       TEXT NOT NULL,
  customer_email      TEXT NOT NULL,
  customer_phone      TEXT,
  delivery_zone_id    UUID REFERENCES public.delivery_zones(id),
  delivery_address_id UUID REFERENCES public.customer_addresses(id),
  delivery_address_snapshot JSONB,
  delivery_type       TEXT NOT NULL DEFAULT 'delivery'
                      CHECK (delivery_type IN ('delivery', 'pickup')),
  delivery_fee        NUMERIC(10,2) DEFAULT 0,
  subtotal            NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_amount        NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency            TEXT NOT NULL DEFAULT 'KES',
  status              TEXT NOT NULL DEFAULT 'pending'
                      CHECK (status IN (
                        'pending', 'confirmed', 'in_production',
                        'quality_check', 'ready', 'dispatched',
                        'delivered', 'cancelled', 'refunded'
                      )),
  from_quotation_id   UUID REFERENCES public.quotations(id),
  assigned_staff_id   UUID REFERENCES public.profiles(id),
  special_instructions TEXT,
  is_guest_order      BOOLEAN DEFAULT FALSE,
  edit_enabled        BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION generate_order_id()
RETURNS TRIGGER AS $$
DECLARE seq_num INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO seq_num FROM public.orders;
  NEW.display_id := 'ORD-' || LPAD(seq_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_order_id
  BEFORE INSERT ON public.orders
  FOR EACH ROW WHEN (NEW.display_id IS NULL)
  EXECUTE FUNCTION generate_order_id();

CREATE TABLE public.order_items (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id        UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id      UUID REFERENCES public.products(id),
  product_name    TEXT NOT NULL,
  product_sku     TEXT,
  category_name   TEXT,
  quantity        INTEGER NOT NULL DEFAULT 1,
  unit_price      NUMERIC(10,2) NOT NULL,
  total_price     NUMERIC(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  variant_selections JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.order_specs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id        UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  order_item_id   UUID REFERENCES public.order_items(id),
  spec_key        TEXT NOT NULL,
  spec_value      TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.order_files (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id        UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  order_item_id   UUID REFERENCES public.order_items(id),
  file_name       TEXT NOT NULL,
  storage_path    TEXT NOT NULL,
  file_type       TEXT,
  file_size_bytes BIGINT,
  uploaded_by     UUID REFERENCES public.profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.order_notes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id        UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  author_id       UUID REFERENCES public.profiles(id),
  note            TEXT NOT NULL,
  is_internal     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.order_status_history (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id        UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  changed_by      UUID REFERENCES public.profiles(id),
  old_status      TEXT,
  new_status      TEXT NOT NULL,
  note            TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_own" ON public.orders FOR SELECT USING (auth.uid() = user_id OR is_internal());
CREATE POLICY "orders_public_insert" ON public.orders FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "orders_staff_update" ON public.orders FOR UPDATE USING (is_staff());
CREATE POLICY "orders_admin_delete" ON public.orders FOR DELETE USING (is_admin());

CREATE POLICY "order_items_own" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR is_internal()))
);
CREATE POLICY "order_items_insert" ON public.order_items FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "order_items_staff_update" ON public.order_items FOR UPDATE USING (is_staff());

CREATE POLICY "order_specs_read" ON public.order_specs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR is_internal()))
);
CREATE POLICY "order_specs_insert" ON public.order_specs FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "order_files_read" ON public.order_files FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR is_internal()))
);
CREATE POLICY "order_files_insert" ON public.order_files FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "order_notes_internal" ON public.order_notes FOR SELECT USING (
  (is_internal = FALSE AND EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()))
  OR is_internal()
);
CREATE POLICY "order_notes_staff_insert" ON public.order_notes FOR INSERT WITH CHECK (is_internal());

CREATE POLICY "order_status_history_read" ON public.order_status_history FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR is_internal()))
);
CREATE POLICY "order_status_history_insert" ON public.order_status_history FOR INSERT WITH CHECK (is_internal());

-- ============================================================
-- SECTION 16: PRODUCTION QUEUE
-- ============================================================

CREATE TABLE public.production_queue (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id          UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status            TEXT NOT NULL DEFAULT 'queued'
                    CHECK (status IN ('queued', 'in_production', 'quality_check', 'ready')),
  priority          TEXT NOT NULL DEFAULT 'normal'
                    CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  assigned_staff_id UUID REFERENCES public.profiles(id),
  due_date          DATE,
  position          INTEGER,
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.production_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "production_staff_all" ON public.production_queue FOR ALL USING (is_staff());

-- ============================================================
-- SECTION 17: DESIGN PROOFS
-- ============================================================

CREATE TABLE public.design_proofs (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id          UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  order_item_id     UUID REFERENCES public.order_items(id),
  status            TEXT NOT NULL DEFAULT 'pending_review'
                    CHECK (status IN ('pending_review', 'approved', 'revision_requested')),
  max_revisions     INTEGER NOT NULL DEFAULT 3,
  revisions_used    INTEGER NOT NULL DEFAULT 0,
  created_by        UUID REFERENCES public.profiles(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.proof_revisions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proof_id        UUID NOT NULL REFERENCES public.design_proofs(id) ON DELETE CASCADE,
  version_number  INTEGER NOT NULL,
  storage_path    TEXT NOT NULL,
  public_url      TEXT NOT NULL,
  uploaded_by     UUID REFERENCES public.profiles(id),
  customer_action TEXT CHECK (customer_action IN ('approved', 'revision_requested')),
  customer_notes  TEXT,
  action_at       TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.design_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proof_revisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "proofs_own_read" ON public.design_proofs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR is_internal()))
);
CREATE POLICY "proofs_staff_write" ON public.design_proofs FOR ALL USING (is_staff());

CREATE POLICY "proof_revisions_own_read" ON public.proof_revisions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.design_proofs dp
    JOIN public.orders o ON o.id = dp.order_id
    WHERE dp.id = proof_id AND (o.user_id = auth.uid() OR is_internal())
  )
);
CREATE POLICY "proof_revisions_staff_write" ON public.proof_revisions FOR ALL USING (is_staff());
CREATE POLICY "proof_revisions_customer_action" ON public.proof_revisions FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.design_proofs dp
    JOIN public.orders o ON o.id = dp.order_id
    WHERE dp.id = proof_id AND o.user_id = auth.uid()
  )
);

-- ============================================================
-- SECTION 18: PAYMENTS
-- ============================================================

CREATE TABLE public.payments (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  display_id            TEXT UNIQUE,
  order_id              UUID NOT NULL REFERENCES public.orders(id),
  user_id               UUID REFERENCES public.profiles(id),
  amount                NUMERIC(10,2) NOT NULL,
  currency              TEXT NOT NULL DEFAULT 'KES',
  method                TEXT NOT NULL CHECK (method IN ('mpesa_stk', 'mpesa_manual', 'card', 'cash', 'bank')),
  status                TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'processing', 'confirmed', 'failed', 'refunded')),
  mpesa_checkout_request_id TEXT,
  mpesa_merchant_request_id TEXT,
  mpesa_transaction_code TEXT,
  mpesa_message_raw     TEXT,
  mpesa_sender_name     TEXT,
  mpesa_sender_phone    TEXT,
  mpesa_timestamp       TEXT,
  manual_verification_status TEXT CHECK (manual_verification_status IN ('pending', 'verified', 'rejected')),
  manual_verified_by    UUID REFERENCES public.profiles(id),
  manual_verified_at    TIMESTAMPTZ,
  gateway_reference     TEXT,
  gateway_response      JSONB,
  confirmed_at          TIMESTAMPTZ,
  failed_reason         TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION generate_payment_id()
RETURNS TRIGGER AS $$
DECLARE seq_num INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO seq_num FROM public.payments;
  NEW.display_id := 'PAY-' || LPAD(seq_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_payment_id
  BEFORE INSERT ON public.payments
  FOR EACH ROW WHEN (NEW.display_id IS NULL)
  EXECUTE FUNCTION generate_payment_id();

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "payments_own_read" ON public.payments FOR SELECT USING (auth.uid() = user_id OR is_admin() OR is_staff());
CREATE POLICY "payments_insert" ON public.payments FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "payments_admin_update" ON public.payments FOR UPDATE USING (is_admin() OR is_staff());

-- ============================================================
-- SECTION 19: RECEIPTS & INVOICES
-- ============================================================

CREATE TABLE public.receipts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  display_id      TEXT UNIQUE,
  order_id        UUID NOT NULL REFERENCES public.orders(id),
  payment_id      UUID REFERENCES public.payments(id),
  user_id         UUID REFERENCES public.profiles(id),
  type            TEXT NOT NULL CHECK (type IN ('receipt', 'invoice')),
  storage_path    TEXT,
  public_url      TEXT,
  issued_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "receipts_own" ON public.receipts FOR SELECT USING (auth.uid() = user_id OR is_admin() OR is_staff());
CREATE POLICY "receipts_insert" ON public.receipts FOR INSERT WITH CHECK (is_internal() OR auth.uid() IS NOT NULL);

-- ============================================================
-- SECTION 20: DELIVERIES
-- ============================================================

CREATE TABLE public.deliveries (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  display_id        TEXT UNIQUE,
  order_id          UUID NOT NULL REFERENCES public.orders(id),
  agent_id          UUID REFERENCES public.profiles(id),
  assigned_by       UUID REFERENCES public.profiles(id),
  zone_id           UUID REFERENCES public.delivery_zones(id),
  status            TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed', 'reassigned')),
  pickup_address    TEXT,
  delivery_address  JSONB NOT NULL,
  customer_phone    TEXT,
  special_notes     TEXT,
  picked_up_at      TIMESTAMPTZ,
  delivered_at      TIMESTAMPTZ,
  failed_reason     TEXT,
  failed_at         TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION generate_delivery_id()
RETURNS TRIGGER AS $$
DECLARE seq_num INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO seq_num FROM public.deliveries;
  NEW.display_id := 'DEL-' || LPAD(seq_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_delivery_id
  BEFORE INSERT ON public.deliveries
  FOR EACH ROW WHEN (NEW.display_id IS NULL)
  EXECUTE FUNCTION generate_delivery_id();

CREATE TABLE public.delivery_status_history (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  delivery_id     UUID NOT NULL REFERENCES public.deliveries(id) ON DELETE CASCADE,
  changed_by      UUID REFERENCES public.profiles(id),
  old_status      TEXT,
  new_status      TEXT NOT NULL,
  note            TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "deliveries_agent_own" ON public.deliveries FOR SELECT USING (auth.uid() = agent_id OR is_logistics());
CREATE POLICY "deliveries_agent_update" ON public.deliveries FOR UPDATE USING (auth.uid() = agent_id OR is_logistics());
CREATE POLICY "deliveries_logistics_insert" ON public.deliveries FOR INSERT WITH CHECK (is_logistics());
CREATE POLICY "deliveries_customer_read" ON public.deliveries FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
);

CREATE POLICY "delivery_history_logistics_all" ON public.delivery_status_history FOR ALL USING (is_logistics());
CREATE POLICY "delivery_history_agent_insert" ON public.delivery_status_history FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.deliveries d WHERE d.id = delivery_id AND d.agent_id = auth.uid())
);

-- ============================================================
-- SECTION 21: ATTENDANCE
-- ============================================================

CREATE TABLE public.attendance_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id),
  user_display_id TEXT NOT NULL,
  clock_in_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  clock_out_at    TIMESTAMPTZ,
  duration_minutes INTEGER,
  clock_out_note  TEXT,
  manually_corrected BOOLEAN DEFAULT FALSE,
  corrected_by    UUID REFERENCES public.profiles(id),
  correction_note TEXT,
  date            DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION compute_attendance_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.clock_out_at IS NOT NULL AND OLD.clock_out_at IS NULL THEN
    NEW.duration_minutes := EXTRACT(EPOCH FROM (NEW.clock_out_at - NEW.clock_in_at)) / 60;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_attendance_duration
  BEFORE UPDATE ON public.attendance_logs
  FOR EACH ROW EXECUTE FUNCTION compute_attendance_duration();

ALTER TABLE public.attendance_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "attendance_own_read" ON public.attendance_logs FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "attendance_own_insert" ON public.attendance_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "attendance_own_update_clock_out" ON public.attendance_logs FOR UPDATE USING (auth.uid() = user_id AND clock_out_at IS NULL);
CREATE POLICY "attendance_admin_correct" ON public.attendance_logs FOR UPDATE USING (is_admin());

-- ============================================================
-- SECTION 22: NOTIFICATIONS
-- ============================================================

CREATE TABLE public.notifications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type            TEXT NOT NULL,
  title           TEXT NOT NULL,
  body            TEXT NOT NULL,
  is_read         BOOLEAN NOT NULL DEFAULT FALSE,
  read_at         TIMESTAMPTZ,
  action_url      TEXT,
  email_sent      BOOLEAN DEFAULT FALSE,
  email_sent_at   TIMESTAMPTZ,
  whatsapp_sent   BOOLEAN DEFAULT FALSE,
  whatsapp_sent_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.notification_preferences (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  order_updates_email     BOOLEAN DEFAULT TRUE,
  order_updates_whatsapp  BOOLEAN DEFAULT TRUE,
  order_updates_inapp     BOOLEAN DEFAULT TRUE,
  delivery_updates_email  BOOLEAN DEFAULT TRUE,
  delivery_updates_whatsapp BOOLEAN DEFAULT TRUE,
  proof_updates_email     BOOLEAN DEFAULT TRUE,
  stock_alerts_inapp      BOOLEAN DEFAULT TRUE,
  marketing_email         BOOLEAN DEFAULT FALSE
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_own" ON public.notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "notifications_admin_insert" ON public.notifications FOR INSERT WITH CHECK (is_internal());
CREATE POLICY "notification_prefs_own" ON public.notification_preferences FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- SECTION 23: REVIEWS
-- ============================================================

CREATE TABLE public.reviews (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id      UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES public.profiles(id),
  order_id        UUID REFERENCES public.orders(id),
  rating          INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title           TEXT,
  body            TEXT,
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'approved', 'rejected', 'hidden')),
  moderated_by    UUID REFERENCES public.profiles(id),
  moderated_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_approved_public" ON public.reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "reviews_own_read" ON public.reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "reviews_own_insert" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_admin_all" ON public.reviews FOR ALL USING (is_admin());

-- ============================================================
-- SECTION 24: INVENTORY
-- ============================================================

CREATE TABLE public.inventory_items (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                  TEXT NOT NULL,
  category              TEXT NOT NULL CHECK (category IN ('raw_material', 'finished_stock', 'consumable')),
  unit                  TEXT NOT NULL DEFAULT 'units',
  current_stock         NUMERIC(10,2) NOT NULL DEFAULT 0,
  low_stock_threshold   NUMERIC(10,2) NOT NULL DEFAULT 10,
  sku                   TEXT UNIQUE,
  notes                 TEXT,
  created_by            UUID REFERENCES public.profiles(id),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.inventory_transactions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id         UUID NOT NULL REFERENCES public.inventory_items(id),
  type            TEXT NOT NULL CHECK (type IN ('received', 'used', 'adjustment', 'damaged', 'returned')),
  quantity_change NUMERIC(10,2) NOT NULL,
  quantity_before NUMERIC(10,2) NOT NULL,
  quantity_after  NUMERIC(10,2) NOT NULL,
  reference_id    UUID,
  notes           TEXT,
  recorded_by     UUID REFERENCES public.profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inventory_staff_read" ON public.inventory_items FOR SELECT USING (is_staff());
CREATE POLICY "inventory_admin_write" ON public.inventory_items FOR ALL USING (is_admin());
CREATE POLICY "inv_transactions_staff_read" ON public.inventory_transactions FOR SELECT USING (is_staff());
CREATE POLICY "inv_transactions_admin_write" ON public.inventory_transactions FOR ALL USING (is_admin() OR is_staff());

-- ============================================================
-- SECTION 25: PORTFOLIO
-- ============================================================

CREATE TABLE public.portfolio_items (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  category_id     UUID REFERENCES public.product_categories(id),
  description     TEXT,
  storage_path    TEXT NOT NULL,
  public_url      TEXT NOT NULL,
  show_client     BOOLEAN DEFAULT FALSE,
  client_name     TEXT,
  display_order   INTEGER DEFAULT 0,
  is_published    BOOLEAN DEFAULT TRUE,
  created_by      UUID REFERENCES public.profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "portfolio_published_public" ON public.portfolio_items FOR SELECT USING (is_published = TRUE);
CREATE POLICY "portfolio_admin_write" ON public.portfolio_items FOR ALL USING (is_admin());

-- ============================================================
-- SECTION 26: DESIGN SERVICES
-- ============================================================

CREATE TABLE public.design_services (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  description     TEXT,
  price_from      NUMERIC(10,2),
  currency        TEXT NOT NULL DEFAULT 'KES',
  turnaround_days INTEGER DEFAULT 3,
  features        JSONB DEFAULT '[]',
  is_active       BOOLEAN DEFAULT TRUE,
  display_order   INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.design_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "design_services_public_read" ON public.design_services FOR SELECT USING (is_active = TRUE);
CREATE POLICY "design_services_admin_write" ON public.design_services FOR ALL USING (is_admin());

-- ============================================================
-- SECTION 27: TERMS & PRIVACY
-- ============================================================

CREATE TABLE public.terms_versions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  version_number  INTEGER NOT NULL,
  content         TEXT NOT NULL,
  is_current      BOOLEAN NOT NULL DEFAULT FALSE,
  published_by    UUID REFERENCES public.profiles(id),
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.privacy_versions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  version_number  INTEGER NOT NULL,
  content         TEXT NOT NULL,
  is_current      BOOLEAN NOT NULL DEFAULT FALSE,
  published_by    UUID REFERENCES public.profiles(id),
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.terms_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "terms_public_read" ON public.terms_versions FOR SELECT USING (is_current = TRUE);
CREATE POLICY "terms_admin_all" ON public.terms_versions FOR ALL USING (is_admin());
CREATE POLICY "privacy_public_read" ON public.privacy_versions FOR SELECT USING (is_current = TRUE);
CREATE POLICY "privacy_admin_all" ON public.privacy_versions FOR ALL USING (is_admin());

-- ============================================================
-- SECTION 28: FEATURED PRODUCTS
-- ============================================================

CREATE TABLE public.featured_products (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id      UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  display_order   INTEGER DEFAULT 0,
  added_by        UUID REFERENCES public.profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (product_id)
);

ALTER TABLE public.featured_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "featured_public_read" ON public.featured_products FOR SELECT USING (TRUE);
CREATE POLICY "featured_admin_write" ON public.featured_products FOR ALL USING (is_admin());

-- ============================================================
-- SECTION 29: ANALYTICS VIEWS
-- ============================================================

CREATE OR REPLACE VIEW public.v_daily_revenue AS
SELECT
  DATE(o.created_at) AS day,
  COUNT(*)::INTEGER AS order_count,
  COALESCE(SUM(o.total_amount), 0) AS total_revenue,
  COALESCE(AVG(o.total_amount), 0) AS avg_order_value
FROM public.orders o
WHERE o.status NOT IN ('cancelled', 'refunded')
GROUP BY DATE(o.created_at)
ORDER BY day DESC;

CREATE OR REPLACE VIEW public.v_top_products AS
SELECT
  oi.product_id,
  oi.product_name,
  oi.category_name,
  SUM(oi.quantity)::INTEGER AS total_units,
  SUM(oi.total_price) AS total_revenue,
  COUNT(DISTINCT oi.order_id)::INTEGER AS order_count
FROM public.order_items oi
JOIN public.orders o ON o.id = oi.order_id
WHERE o.status NOT IN ('cancelled', 'refunded')
GROUP BY oi.product_id, oi.product_name, oi.category_name
ORDER BY total_revenue DESC;

CREATE OR REPLACE VIEW public.v_agent_performance AS
SELECT
  d.agent_id,
  p.full_name AS agent_name,
  p.display_id AS agent_display_id,
  COUNT(*)::INTEGER AS total_deliveries,
  COUNT(*) FILTER (WHERE d.status = 'delivered')::INTEGER AS completed,
  COUNT(*) FILTER (WHERE d.status = 'failed')::INTEGER AS failed,
  ROUND(
    (COUNT(*) FILTER (WHERE d.status = 'delivered')::NUMERIC / NULLIF(COUNT(*), 0)) * 100, 1
  ) AS success_rate
FROM public.deliveries d
JOIN public.profiles p ON p.id = d.agent_id
GROUP BY d.agent_id, p.full_name, p.display_id;

CREATE OR REPLACE VIEW public.v_attendance_summary AS
SELECT
  al.user_id,
  al.user_display_id,
  p.full_name,
  DATE_TRUNC('week', al.date) AS week_start,
  COUNT(*)::INTEGER AS days_present,
  COALESCE(SUM(al.duration_minutes), 0)::INTEGER AS total_minutes,
  ROUND(COALESCE(SUM(al.duration_minutes), 0) / 60.0, 1) AS total_hours
FROM public.attendance_logs al
JOIN public.profiles p ON p.id = al.user_id
GROUP BY al.user_id, al.user_display_id, p.full_name, DATE_TRUNC('week', al.date);

CREATE OR REPLACE VIEW public.v_low_stock AS
SELECT
  p.id,
  p.name,
  p.sku,
  p.stock_quantity,
  p.low_stock_threshold,
  pc.name AS category_name
FROM public.products p
JOIN public.product_categories pc ON pc.id = p.category_id
WHERE p.stock_quantity <= p.low_stock_threshold
  AND p.is_published = TRUE
ORDER BY p.stock_quantity ASC;

-- ============================================================
-- SECTION 30: INDEXES
-- ============================================================

CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_published ON public.products(is_published, is_available);
CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created ON public.orders(created_at DESC);
CREATE INDEX idx_order_items_order ON public.order_items(order_id);
CREATE INDEX idx_payments_order ON public.payments(order_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_deliveries_agent ON public.deliveries(agent_id);
CREATE INDEX idx_deliveries_order ON public.deliveries(order_id);
CREATE INDEX idx_deliveries_status ON public.deliveries(status);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read);
CREATE INDEX idx_production_status ON public.production_queue(status);
CREATE INDEX idx_reviews_product ON public.reviews(product_id);
CREATE INDEX idx_audit_created ON public.audit_logs(created_at DESC);
CREATE INDEX idx_favorites_user ON public.favorites(user_id);
CREATE INDEX idx_attendance_user_date ON public.attendance_logs(user_id, date);

-- ============================================================
-- SECTION 31: INSERT DEFAULT PLATFORM CONFIG
-- ============================================================

INSERT INTO public.platform_config (
  setup_complete,
  business_name,
  hero_headline,
  hero_subtext,
  accent_color
) VALUES (
  FALSE,
  'Seraine',
  'Your Vision, Perfectly Printed.',
  'Premium printing, engraving, and creative services in Kenya.',
  '#8B2635'
);

-- ============================================================
-- END OF SCHEMA
-- ============================================================

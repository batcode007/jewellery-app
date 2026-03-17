-- ============================================================
-- LUMIÈRE JEWELLERS — Supabase Schema
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================

-- 1. USERS (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. CATALOGUE — Metal types
CREATE TABLE public.metals (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,        -- Gold, Silver, Diamond, Sterling Silver, Platinum
  slug TEXT UNIQUE NOT NULL,
  display_order INT DEFAULT 0
);

-- 3. CATALOGUE — Jewellery types
CREATE TABLE public.jewellery_types (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,        -- Rings, Earrings, Pendants, Necklaces, etc.
  slug TEXT UNIQUE NOT NULL,
  display_order INT DEFAULT 0
);

-- 4. CATALOGUE — Collections
CREATE TABLE public.collections (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,        -- Light Jewellery, Gifting, Bridal, Everyday, etc.
  slug TEXT UNIQUE NOT NULL,
  display_order INT DEFAULT 0
);

-- 5. CATALOGUE — Items (main product table)
CREATE TABLE public.items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  metal_id INT REFERENCES public.metals(id),
  jewellery_type_id INT REFERENCES public.jewellery_types(id),
  weight TEXT,                       -- e.g., "4.2g"
  weight_grams NUMERIC(8,2),        -- numeric for calculations
  purity TEXT,                       -- e.g., "22K", "925 Silver"
  price NUMERIC(12,2),              -- stored in paisa or rupees
  price_display TEXT,                -- e.g., "₹18,500"
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. CATALOGUE — Item-Collection many-to-many (item can be in multiple collections)
CREATE TABLE public.item_collections (
  item_id UUID REFERENCES public.items(id) ON DELETE CASCADE,
  collection_id INT REFERENCES public.collections(id) ON DELETE CASCADE,
  PRIMARY KEY (item_id, collection_id)
);

-- 7. CATALOGUE — Item images
CREATE TABLE public.item_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES public.items(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  display_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. CATALOGUE — Additional tags for flexible filtering
CREATE TABLE public.tags (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,        -- e.g., "Handcrafted", "Bestseller", "New Arrival"
  slug TEXT UNIQUE NOT NULL
);

CREATE TABLE public.item_tags (
  item_id UUID REFERENCES public.items(id) ON DELETE CASCADE,
  tag_id INT REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (item_id, tag_id)
);

-- 9. GOLD SCHEME — Scheme plans
CREATE TABLE public.gold_schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  monthly_amount NUMERIC(10,2) NOT NULL CHECK (monthly_amount >= 500),
  total_months INT DEFAULT 12,
  paid_months INT DEFAULT 11,       -- user pays 11, gets 1 free
  free_months INT DEFAULT 1,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  total_value NUMERIC(12,2) GENERATED ALWAYS AS (monthly_amount * total_months) STORED,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. GOLD SCHEME — Individual payments (passbook entries)
CREATE TABLE public.scheme_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_id UUID REFERENCES public.gold_schemes(id) ON DELETE CASCADE,
  installment_number INT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  is_free BOOLEAN DEFAULT false,    -- true for the 12th month
  due_date DATE NOT NULL,
  paid_date DATE,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'paid', 'overdue', 'free')),
  payment_reference TEXT,           -- transaction ID from payment gateway
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. DAILY RATES
CREATE TABLE public.daily_rates (
  id SERIAL PRIMARY KEY,
  rate_date DATE NOT NULL DEFAULT CURRENT_DATE,
  gold_24k NUMERIC(10,2),          -- per gram
  gold_22k NUMERIC(10,2),
  gold_18k NUMERIC(10,2),
  silver NUMERIC(10,2),
  platinum NUMERIC(10,2),
  gold_change NUMERIC(8,2),         -- +/- from previous day
  silver_change NUMERIC(8,2),
  updated_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(rate_date)
);

-- 12. STORES
CREATE TABLE public.stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT DEFAULT 'New Delhi',
  phone TEXT,
  email TEXT,
  hours TEXT,                        -- e.g., "10:00 AM - 9:00 PM"
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 13. FEEDBACK
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  name TEXT,                         -- for non-logged-in users
  phone TEXT,
  type TEXT NOT NULL CHECK (type IN ('feedback', 'suggestion', 'complaint')),
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'resolved')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);


-- ============================================================
-- SEED DATA
-- ============================================================

-- Metals
INSERT INTO public.metals (name, slug, display_order) VALUES
  ('Gold', 'gold', 1),
  ('Silver', 'silver', 2),
  ('Diamond', 'diamond', 3),
  ('Sterling Silver', 'sterling-silver', 4),
  ('Platinum', 'platinum', 5);

-- Jewellery Types
INSERT INTO public.jewellery_types (name, slug, display_order) VALUES
  ('Rings', 'rings', 1),
  ('Earrings', 'earrings', 2),
  ('Pendants', 'pendants', 3),
  ('Necklaces', 'necklaces', 4),
  ('Bangles', 'bangles', 5),
  ('Bracelets', 'bracelets', 6),
  ('Chains', 'chains', 7),
  ('Mangalsutra', 'mangalsutra', 8),
  ('Nose Pins', 'nose-pins', 9);

-- Collections
INSERT INTO public.collections (name, slug, display_order) VALUES
  ('Light Jewellery', 'light-jewellery', 1),
  ('Gifting', 'gifting', 2),
  ('Bridal', 'bridal', 3),
  ('Everyday', 'everyday', 4),
  ('Festive', 'festive', 5),
  ('Office Wear', 'office-wear', 6);

-- Tags
INSERT INTO public.tags (name, slug) VALUES
  ('Bestseller', 'bestseller'),
  ('New Arrival', 'new-arrival'),
  ('Handcrafted', 'handcrafted'),
  ('Limited Edition', 'limited-edition'),
  ('Trending', 'trending');

-- Sample stores
INSERT INTO public.stores (name, address, phone, hours, latitude, longitude) VALUES
  ('Flagship Store - Connaught Place', 'A-12, Block A, Connaught Place, New Delhi - 110001', '+91 11 2341 5678', '10:00 AM - 9:00 PM', 28.6315000, 77.2167000),
  ('South Extension Boutique', 'Shop 45, South Extension Part II, New Delhi - 110049', '+91 11 2634 9012', '10:30 AM - 8:30 PM', 28.5677000, 77.2220000),
  ('Karol Bagh Showroom', '1523, Main Market, Karol Bagh, New Delhi - 110005', '+91 11 2872 3456', '10:00 AM - 9:00 PM', 28.6519000, 77.1909000);

-- Today's sample rates
INSERT INTO public.daily_rates (rate_date, gold_24k, gold_22k, gold_18k, silver, platinum, gold_change, silver_change) VALUES
  (CURRENT_DATE, 7842.00, 7188.00, 5882.00, 98.50, 3120.00, 120.00, -1.20);


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gold_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheme_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jewellery_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- PUBLIC read access for catalogue, rates, stores
CREATE POLICY "Anyone can view active items" ON public.items FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view metals" ON public.metals FOR SELECT USING (true);
CREATE POLICY "Anyone can view jewellery_types" ON public.jewellery_types FOR SELECT USING (true);
CREATE POLICY "Anyone can view collections" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Anyone can view tags" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Anyone can view item_images" ON public.item_images FOR SELECT USING (true);
CREATE POLICY "Anyone can view item_collections" ON public.item_collections FOR SELECT USING (true);
CREATE POLICY "Anyone can view item_tags" ON public.item_tags FOR SELECT USING (true);
CREATE POLICY "Anyone can view rates" ON public.daily_rates FOR SELECT USING (true);
CREATE POLICY "Anyone can view active stores" ON public.stores FOR SELECT USING (is_active = true);

-- PROFILES: users see own profile, admins see all
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ADMIN: full access to manage catalogue
CREATE POLICY "Admins can manage items" ON public.items FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can manage item_images" ON public.item_images FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can manage item_collections" ON public.item_collections FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can manage item_tags" ON public.item_tags FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can manage rates" ON public.daily_rates FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- GOLD SCHEMES: users see own, admins see all
CREATE POLICY "Users can view own schemes" ON public.gold_schemes FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can create schemes" ON public.gold_schemes FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all schemes" ON public.gold_schemes FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- SCHEME PAYMENTS: users see own, admins see all
CREATE POLICY "Users can view own payments" ON public.scheme_payments FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.gold_schemes WHERE id = scheme_id AND user_id = auth.uid()));
CREATE POLICY "Admins can manage payments" ON public.scheme_payments FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- FEEDBACK: anyone can submit, admins can view all
CREATE POLICY "Anyone can submit feedback" ON public.feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own feedback" ON public.feedback FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all feedback" ON public.feedback FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update feedback" ON public.feedback FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));


-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, phone, name, role)
  VALUES (
    NEW.id,
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to enroll in gold scheme + create all 12 payment entries
CREATE OR REPLACE FUNCTION public.enroll_gold_scheme(
  p_user_id UUID,
  p_monthly_amount NUMERIC
)
RETURNS UUID AS $$
DECLARE
  v_scheme_id UUID;
  v_start_date DATE := CURRENT_DATE;
BEGIN
  -- Create the scheme
  INSERT INTO public.gold_schemes (user_id, monthly_amount, start_date, end_date)
  VALUES (p_user_id, p_monthly_amount, v_start_date, v_start_date + INTERVAL '12 months')
  RETURNING id INTO v_scheme_id;

  -- Create 12 payment entries
  FOR i IN 1..12 LOOP
    INSERT INTO public.scheme_payments (
      scheme_id, installment_number, amount, is_free, due_date, status
    ) VALUES (
      v_scheme_id,
      i,
      CASE WHEN i <= 11 THEN p_monthly_amount ELSE 0 END,
      CASE WHEN i = 12 THEN true ELSE false END,
      v_start_date + ((i - 1) || ' months')::INTERVAL,
      CASE WHEN i = 12 THEN 'free' ELSE 'upcoming' END
    );
  END LOOP;

  RETURN v_scheme_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================
-- STORAGE BUCKET for item images
-- ============================================================
-- Run this separately in Supabase Dashboard > Storage > Create Bucket
-- Bucket name: "item-images"
-- Public: Yes

-- Storage policies (run in SQL editor after creating bucket):
-- CREATE POLICY "Anyone can view item images"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'item-images');
--
-- CREATE POLICY "Admins can upload item images"
--   ON storage.objects FOR INSERT
--   WITH CHECK (
--     bucket_id = 'item-images'
--     AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
--   );


-- ============================================================
-- INDEXES for performance
-- ============================================================
-- CREATE INDEX idx_items_metal ON public.items(metal_id);
-- CREATE INDEX idx_items_type ON public.items(jewellery_type_id);
-- CREATE INDEX idx_items_active ON public.items(is_active);
-- CREATE INDEX idx_items_featured ON public.items(is_featured) WHERE is_featured = true;
-- CREATE INDEX idx_item_collections_item ON public.item_collections(item_id);
-- CREATE INDEX idx_item_collections_collection ON public.item_collections(collection_id);
-- CREATE INDEX idx_item_images_item ON public.item_images(item_id);
-- CREATE INDEX idx_scheme_user ON public.gold_schemes(user_id);
-- CREATE INDEX idx_scheme_payments_scheme ON public.scheme_payments(scheme_id);
-- CREATE INDEX idx_daily_rates_date ON public.daily_rates(rate_date DESC);
-- CREATE INDEX idx_feedback_status ON public.feedback(status);
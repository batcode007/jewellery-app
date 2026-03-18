import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  phone: string;
  name: string | null;
  role: "user" | "admin";
};

export type Item = {
  id: string;
  name: string;
  description: string | null;
  metal_id: number;
  jewellery_type_id: number;
  weight: string;
  weight_grams: number;
  purity: string;
  price: number;
  price_display: string;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  metals?: { id: number; name: string; slug: string };
  jewellery_types?: { id: number; name: string; slug: string };
  item_collections?: { collections: { id: number; name: string; slug: string } }[];
  item_images?: { id: string; url: string; is_primary: boolean; display_order: number }[];
};

export type GoldScheme = {
  id: string;
  user_id: string;
  monthly_amount: number;
  total_months: number;
  status: string;
  start_date: string;
  total_value: number;
  scheme_payments?: SchemePayment[];
};

export type SchemePayment = {
  id: string;
  installment_number: number;
  amount: number;
  is_free: boolean;
  due_date: string;
  paid_date: string | null;
  status: string;
};

export type DailyRate = {
  gold_24k: number;
  gold_22k: number;
  gold_18k: number;
  silver: number;
  gold_change: number;
  silver_change: number;
  rate_date: string;
};

export type Store = {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  hours: string;
  latitude: number;
  longitude: number;
};

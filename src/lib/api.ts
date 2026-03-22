import { supabase } from "./supabase";
import type { Item, DailyRate, Store, GoldScheme } from "./supabase";

// ---- CATALOGUE ----
export async function getItems(filters?: {
  metals?: string[];
  types?: string[];
  collections?: string[];
  search?: string;
  featured?: boolean;
}) {
  let query = supabase
    .from("items")
    .select(`
      *,
      metals (id, name, slug),
      jewellery_types (id, name, slug),
      item_collections (collections (id, name, slug)),
      item_images (id, url, is_primary, display_order)
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (filters?.metals?.length) {
    const { data: metalRows } = await supabase
      .from("metals")
      .select("id")
      .in("slug", filters.metals);
    if (metalRows?.length) {
      query = query.in("metal_id", metalRows.map((m) => m.id));
    }
  }

  if (filters?.types?.length) {
    const { data: typeRows } = await supabase
      .from("jewellery_types")
      .select("id")
      .in("slug", filters.types);
    if (typeRows?.length) {
      query = query.in("jewellery_type_id", typeRows.map((t) => t.id));
    }
  }

  if (filters?.search) {
    query = query.ilike("name", `%${filters.search}%`);
  }

  if (filters?.featured) {
    query = query.eq("is_featured", true);
  }

  const { data, error } = await query;
  if (error) throw error;

  // Client-side collection filter (Supabase can't filter nested many-to-many easily)
  let items = data || [];
  if (filters?.collections?.length) {
    items = items.filter((item: any) =>
      item.item_collections?.some((ic: any) =>
        filters.collections!.includes(ic.collections?.slug)
      )
    );
  }

  return items as Item[];
}

export async function getItemById(id: string) {
  const { data, error } = await supabase
    .from("items")
    .select(`
      *,
      metals (id, name, slug),
      jewellery_types (id, name, slug),
      item_collections (collections (id, name, slug)),
      item_images (id, url, is_primary, display_order)
    `)
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as Item;
}

// ---- FILTERS (metadata) ----
export async function getMetals() {
  const { data } = await supabase.from("metals").select("*").eq("is_deleted",false).order("display_order");
  return data || [];
}
export async function getJewelleryTypes() {
  const { data } = await supabase.from("jewellery_types").select("*").order("display_order");
  return data || [];
}
export async function getCollections() {
  const { data } = await supabase.from("collections").select("*").order("display_order");
  return data || [];
}

// ---- RATES ----
export async function getTodayRates(): Promise<DailyRate | null> {
  const { data } = await supabase
    .from("daily_rates")
    .select("*")
    .order("rate_date", { ascending: false })
    .limit(1)
    .single();
  return data;
}

// ---- STORES ----
export async function getStores(): Promise<Store[]> {
  const { data } = await supabase.from("stores").select("*").eq("is_active", true);
  return data || [];
}

// ---- GOLD SCHEME ----
export async function getUserScheme(userId: string) {
  const { data } = await supabase
    .from("gold_schemes")
    .select("*, scheme_payments (*)")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (data?.scheme_payments) {
    data.scheme_payments.sort(
      (a: any, b: any) => a.installment_number - b.installment_number
    );
  }
  return data as GoldScheme | null;
}

export async function enrollScheme(userId: string, monthlyAmount: number, schemeType: "12+1" | "20+2" = "12+1") {
  const { data, error } = await supabase.rpc("enroll_gold_scheme", {
    p_user_id: userId,
    p_monthly_amount: monthlyAmount,
    p_scheme_type: schemeType,
  });
  if (error) throw error;
  return data;
}

export async function adminEnrollUserScheme(phone: string, monthlyAmount: number, schemeType: "12+1" | "20+2") {
  const { data: rows } = await supabase.rpc("get_profile_by_phone", { p_phone: phone });
  const user = rows?.[0];
  if (!user) throw new Error("No user found with that phone number");
  const { data, error } = await supabase.rpc("enroll_gold_scheme", {
    p_user_id: user.id,
    p_monthly_amount: monthlyAmount,
    p_scheme_type: schemeType,
  });
  if (error) throw error;
  return data;
}

export async function adminRecordPayment(paymentId: string, paidDate: string, amount: number) {
  const { error } = await supabase.rpc("admin_record_payment", {
    p_payment_id: paymentId,
    p_paid_date: paidDate,
    p_amount: amount,
  });
  if (error) throw error;
}

// ---- FEEDBACK ----
export async function submitFeedback(payload: {
  user_id?: string;
  name?: string;
  phone?: string;
  type: string;
  message: string;
}) {
  const { error } = await supabase.from("feedback").insert(payload);
  if (error) throw error;
}

// ---- ADMIN: Items ----
export async function adminUpdateItem(id: string, item: {
  name: string;
  description?: string;
  metal_id: number;
  jewellery_type_id: number;
  weight: string;
  weight_grams?: number;
  purity: string;
  price: number;
  price_display: string;
  is_featured?: boolean;
  collection_ids?: number[];
}) {
  const { collection_ids, ...itemData } = item;
  const { error } = await supabase.from("items").update(itemData).eq("id", id);
  if (error) throw error;

  if (collection_ids !== undefined) {
    await supabase.from("item_collections").delete().eq("item_id", id);
    if (collection_ids.length) {
      await supabase.from("item_collections").insert(
        collection_ids.map((cid) => ({ item_id: id, collection_id: cid }))
      );
    }
  }
}

export async function adminCreateItem(item: {
  name: string;
  description?: string;
  metal_id: number;
  jewellery_type_id: number;
  weight: string;
  weight_grams?: number;
  purity: string;
  price: number;
  price_display: string;
  is_featured?: boolean;
  created_by: string;
  collection_ids?: number[];
}) {
  const { collection_ids, ...itemData } = item;
  const { data, error } = await supabase
    .from("items")
    .insert(itemData)
    .select()
    .single();
  if (error) throw error;

  if (collection_ids?.length && data) {
    await supabase.from("item_collections").insert(
      collection_ids.map((cid) => ({ item_id: data.id, collection_id: cid }))
    );
  }
  return data;
}

export async function adminUploadImage(file: File, itemId: string) {
  const ext = file.name.split(".").pop();
  const path = `${itemId}/${Date.now()}.${ext}`;
  const { error: uploadErr } = await supabase.storage
    .from("item-images")
    .upload(path, file);
  if (uploadErr) throw uploadErr;

  const { data: urlData } = supabase.storage
    .from("item-images")
    .getPublicUrl(path);

  const { error: dbErr } = await supabase.from("item_images").insert({
    item_id: itemId,
    url: urlData.publicUrl,
    is_primary: true,
  });
  if (dbErr) throw dbErr;
  return urlData.publicUrl;
}

// ---- ADMIN: Scheme users ----
export async function adminGetSchemeUsers() {
  const { data } = await supabase
    .from("gold_schemes")
    .select("*, profiles (name, phone), scheme_payments (*)")
    .order("created_at", { ascending: false });
  return data || [];
}

// ---- ADMIN: Feedback ----
export async function adminGetFeedback() {
  const { data } = await supabase
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false });
  return data || [];
}

// ---- ADMIN: Update rates ----
export async function adminUpdateRates(rates: Partial<DailyRate> & { updated_by: string }) {
  const { error } = await supabase.from("daily_rates").upsert(
    { ...rates, rate_date: new Date().toISOString().split("T")[0] },
    { onConflict: "rate_date" }
  );
  if (error) throw error;
}

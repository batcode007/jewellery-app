"use client";
import { useEffect, useState } from "react";
import { getItems, getMetals, getJewelleryTypes, getCollections, getTodayRates, adminCreateItem, adminUpdateItem, adminUploadImage } from "@/lib/api";
import type { Item, DailyRate } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const EMPTY_FORM = { name: "", description: "", metal_id: 0, jewellery_type_id: 0, weight: "", weight_grams: "", purity: "", price: "", is_featured: false, collection_ids: [] as number[] };

export default function AdminCatalogue() {
  const { profile } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [metals, setMetals] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [rates, setRates] = useState<DailyRate | null>(null);
  const [priceAutoCalc, setPriceAutoCalc] = useState(false);

  useEffect(() => {
    getItems().then(setItems);
    getMetals().then(setMetals);
    getJewelleryTypes().then(setTypes);
    getCollections().then(setCollections);
    getTodayRates().then(setRates);
  }, []);

  function computePrice(weightGrams: string, purity: string): string {
    if (!rates || !weightGrams || !purity) return "";
    const w = parseFloat(weightGrams);
    if (isNaN(w) || w <= 0) return "";
    const p = purity.toUpperCase().replace(/\s/g, "");
    let ratePerTenG: number | null = null;
    if (p === "24K") ratePerTenG = rates.gold_24k;
    else if (p === "22K") ratePerTenG = rates.gold_22k;
    else if (p === "18K") ratePerTenG = rates.gold_18k;
    else if (p === "925" || p === "SILVER") ratePerTenG = rates.silver * 10; // silver is per gram
    if (!ratePerTenG) return "";
    return String(Math.round((ratePerTenG / 10) * w));
  }

  function openAdd() {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setPriceAutoCalc(false);
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  }

  function openEdit(item: Item) {
    setEditingItem(item);
    setPriceAutoCalc(false);
    setForm({
      name: item.name,
      description: item.description || "",
      metal_id: item.metal_id,
      jewellery_type_id: item.jewellery_type_id,
      weight: item.weight || "",
      weight_grams: item.weight_grams ? String(item.weight_grams) : "",
      purity: item.purity || "",
      price: String(item.price),
      is_featured: item.is_featured,
      collection_ids: item.item_collections?.map((ic) => ic.collections.id) || [],
    });
    setImageFile(null);
    // Show existing primary image as preview
    const primary = item.item_images?.find((img) => img.is_primary) || item.item_images?.[0];
    setImagePreview(primary?.url || null);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingItem(null);
    setImageFile(null);
    setImagePreview(null);
  }

  function handleImageChange(file: File | null) {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const price = parseFloat(form.price);
      const priceDisplay = `₹${price.toLocaleString("en-IN")}`;

      const weightGrams = form.weight_grams ? parseFloat(form.weight_grams) : undefined;

      if (editingItem) {
        await adminUpdateItem(editingItem.id, {
          ...form,
          price,
          price_display: priceDisplay,
          weight_grams: weightGrams,
          collection_ids: form.collection_ids,
        });
        if (imageFile) {
          await adminUploadImage(imageFile, editingItem.id);
        }
      } else {
        const item = await adminCreateItem({
          ...form,
          price,
          price_display: priceDisplay,
          weight_grams: weightGrams,
          created_by: profile?.id || "",
          collection_ids: form.collection_ids,
        });
        if (imageFile && item) {
          await adminUploadImage(imageFile, item.id);
        }
      }

      closeModal();
      getItems().then(setItems);
    } catch (e: any) {
      alert("Error: " + e.message);
    }
    setSaving(false);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-navy">Catalogue Items ({items.length})</h2>
        <button onClick={openAdd} className="bg-gradient-to-r from-gold to-gold-dark text-navy text-sm font-semibold px-5 py-2.5 rounded-lg">+ Add Item</button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              {["Item", "Metal", "Type", "Weight", "Price", ""].map((h, i) => (
                <th key={i} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.slice(0, 20).map((it) => (
              <tr key={it.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                <td className="px-4 py-3 font-medium text-navy">{it.name}</td>
                <td className="px-4 py-3 text-gray-500">{it.metals?.name}</td>
                <td className="px-4 py-3 text-gray-500">{it.jewellery_types?.name}</td>
                <td className="px-4 py-3 text-gray-500">{it.weight}</td>
                <td className="px-4 py-3 font-semibold">{it.price_display}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => openEdit(it)}
                    className="text-xs text-gold-dark font-medium hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <div>
                <h3 className="text-lg font-bold text-navy">{editingItem ? "Edit Item" : "Add New Item"}</h3>
                <p className="text-xs text-gray-400 mt-0.5">Fields marked * are required</p>
              </div>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 text-lg">✕</button>
            </div>

            <div className="p-6 grid gap-6">
              {/* Basic Info */}
              <section>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Basic Info</h4>
                <div className="grid gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Item Name *</label>
                    <input
                      placeholder="e.g. Gold Chain Necklace"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Description</label>
                    <textarea
                      placeholder="Brief description of the piece..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold transition-colors resize-none"
                    />
                  </div>
                </div>
              </section>

              {/* Specifications */}
              <section>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Specifications</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Metal *</label>
                    <select
                      value={form.metal_id}
                      onChange={(e) => setForm({ ...form, metal_id: +e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold transition-colors bg-white"
                    >
                      <option value={0} disabled>Select metal</option>
                      {metals.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Type *</label>
                    <select
                      value={form.jewellery_type_id}
                      onChange={(e) => setForm({ ...form, jewellery_type_id: +e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold transition-colors bg-white"
                    >
                      <option value={0} disabled>Select type</option>
                      {types.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Purity</label>
                    <input
                      placeholder="e.g. 22K, 18K, 925"
                      value={form.purity}
                      onChange={(e) => {
                        const purity = e.target.value;
                        const computed = computePrice(form.weight_grams, purity);
                        setForm({ ...form, purity, ...(computed ? { price: computed } : {}) });
                        if (computed) setPriceAutoCalc(true);
                      }}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Weight (display)</label>
                    <input
                      placeholder="e.g. 4.2g"
                      value={form.weight}
                      onChange={(e) => setForm({ ...form, weight: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Weight in grams <span className="text-gray-400 font-normal">(for price calc)</span></label>
                    <input
                      type="number"
                      placeholder="e.g. 4.2"
                      value={form.weight_grams}
                      onChange={(e) => {
                        const weight_grams = e.target.value;
                        const computed = computePrice(weight_grams, form.purity);
                        setForm({ ...form, weight_grams, ...(computed ? { price: computed } : {}) });
                        if (computed) setPriceAutoCalc(true);
                      }}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>
              </section>

              {/* Pricing */}
              <section>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Pricing</h4>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-gray-600">Price (₹) *</label>
                    {rates && form.weight_grams && form.purity && (
                      <button
                        type="button"
                        onClick={() => {
                          const computed = computePrice(form.weight_grams, form.purity);
                          if (computed) { setForm((f) => ({ ...f, price: computed })); setPriceAutoCalc(true); }
                        }}
                        className="text-[11px] text-gold-dark font-medium hover:underline"
                      >
                        ↺ Recalculate
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₹</span>
                    <input
                      type="number"
                      placeholder="18500"
                      value={form.price}
                      onChange={(e) => { setForm({ ...form, price: e.target.value }); setPriceAutoCalc(false); }}
                      className="w-full pl-7 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  {form.price && !isNaN(parseFloat(form.price)) && (
                    <p className="text-xs text-gray-400 mt-1">
                      Displays as: <span className="text-gold-dark font-medium">₹{parseFloat(form.price).toLocaleString("en-IN")}</span>
                      {priceAutoCalc && rates && <span className="ml-2 text-green-600">· auto-calculated from today's rate</span>}
                    </p>
                  )}
                  {!rates && <p className="text-xs text-amber-500 mt-1">No rates set today — price won't auto-calculate</p>}
                </div>
              </section>

              {/* Collections */}
              <section>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Collections</h4>
                <div className="flex flex-wrap gap-2">
                  {collections.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, collection_ids: f.collection_ids.includes(c.id) ? f.collection_ids.filter((x: number) => x !== c.id) : [...f.collection_ids, c.id] }))}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${form.collection_ids.includes(c.id) ? "bg-gold text-navy border-gold" : "border-gray-200 text-gray-500 hover:border-gold/50"}`}
                    >
                      {form.collection_ids.includes(c.id) && <span className="mr-1">✓</span>}{c.name}
                    </button>
                  ))}
                </div>
              </section>

              {/* Image Upload */}
              <section>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Product Image</h4>
                <label className="block cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e.target.files?.[0] || null)} />
                  {imagePreview ? (
                    <div className="relative rounded-xl overflow-hidden border border-gray-200 h-40">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white text-sm font-medium">Click to change</span>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-200 rounded-xl h-32 flex flex-col items-center justify-center gap-2 hover:border-gold/50 transition-colors">
                      <span className="text-2xl">📷</span>
                      <span className="text-sm text-gray-400">Click to upload image</span>
                      <span className="text-xs text-gray-300">JPG, PNG, WEBP</span>
                    </div>
                  )}
                </label>
              </section>

              {/* Featured toggle */}
              <section>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setForm((f) => ({ ...f, is_featured: !f.is_featured }))}
                    className={`w-10 h-6 rounded-full transition-colors relative ${form.is_featured ? "bg-gold" : "bg-gray-200"}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.is_featured ? "left-5" : "left-1"}`} />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-navy">Feature on homepage</span>
                    <p className="text-xs text-gray-400">Show this item in the featured section</p>
                  </div>
                </label>
              </section>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3 rounded-b-2xl">
              <button onClick={closeModal} className="flex-1 py-2.5 rounded-lg bg-gray-100 text-gray-600 font-medium text-sm hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name || !form.price || !form.metal_id || !form.jewellery_type_id || saving}
                className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold text-sm disabled:opacity-40 transition-opacity"
              >
                {saving ? "Saving..." : editingItem ? "Save Changes" : "Add Item"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import {
  getItems, getMetals, getJewelleryTypes, getCollections, getTodayRates,
  adminCreateItem, adminUpdateItem, adminUploadImage, adminDeleteImage,
  adminSetPrimaryImage, adminDelete360Frames,
} from "@/lib/api";
import type { Item, DailyRate } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const EMPTY_FORM = {
  name: "", description: "", metal_id: 0, jewellery_type_id: 0,
  weight: "", weight_grams: "", purity: "", price: "", is_featured: false,
  collection_ids: [] as number[],
};

type ExistingImage = { id: string; url: string; is_primary: boolean };

export default function AdminCatalogueContent() {
  const { profile } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [metals, setMetals] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [rates, setRates] = useState<DailyRate | null>(null);
  const [priceAutoCalc, setPriceAutoCalc] = useState(false);

  // Gallery image state
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [primaryKey, setPrimaryKey] = useState<string | null>(null); // "e:{id}" | "n:{index}"

  // 360 frames state
  const [existing360Count, setExisting360Count] = useState(0);
  const [new360Files, setNew360Files] = useState<File[]>([]);
  const [new360Previews, setNew360Previews] = useState<string[]>([]);
  const [replace360, setReplace360] = useState(false);

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
    // normalise: "22 kt" → "22K", "22KT" → "22K", "22K" → "22K"
    const p = purity.toUpperCase().replace(/\s/g, "").replace(/KT$/, "K");
    let ratePerTenG: number | null = null;
    if (p === "24K") ratePerTenG = rates.gold_24k;
    else if (p === "22K") ratePerTenG = rates.gold_22k;
    else if (p === "18K") ratePerTenG = rates.gold_18k;
    else if (p === "925" || p === "999" || p === "SILVER") ratePerTenG = rates.silver * 10;
    if (!ratePerTenG) return "";
    return String(Math.round((ratePerTenG / 10) * w));
  }

  function resetImageState() {
    setExistingImages([]);
    setImagesToDelete([]);
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setPrimaryKey(null);
    setExisting360Count(0);
    setNew360Files([]);
    setNew360Previews([]);
    setReplace360(false);
  }

  function openAdd() {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setPriceAutoCalc(false);
    resetImageState();
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
    resetImageState();

    const gallery = (item.item_images || [])
      .filter((img) => img.frame_type !== "360")
      .sort((a, b) => a.display_order - b.display_order);
    const frames = (item.item_images || []).filter((img) => img.frame_type === "360");

    setExistingImages(gallery.map((img) => ({ id: img.id, url: img.url, is_primary: img.is_primary })));
    const primary = gallery.find((img) => img.is_primary) || gallery[0];
    if (primary) setPrimaryKey(`e:${primary.id}`);
    setExisting360Count(frames.length);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingItem(null);
    setSaveError(null);
    resetImageState();
  }

  // ── Gallery image handlers ──────────────────────────────────────────────

  function handleAddGalleryImages(files: FileList | null) {
    if (!files || !files.length) return;
    const arr = Array.from(files);
    const prevCount = newImageFiles.length;
    setNewImageFiles((prev) => [...prev, ...arr]);
    arr.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => setNewImagePreviews((prev) => [...prev, e.target?.result as string]);
      reader.readAsDataURL(file);
    });
    if (!primaryKey && existingImages.length === 0 && prevCount === 0) {
      setPrimaryKey("n:0");
    }
  }

  function removeExistingImage(id: string) {
    const remaining = existingImages.filter((img) => img.id !== id);
    setExistingImages(remaining);
    setImagesToDelete((prev) => [...prev, id]);
    if (primaryKey === `e:${id}`) {
      if (remaining.length > 0) setPrimaryKey(`e:${remaining[0].id}`);
      else if (newImageFiles.length > 0) setPrimaryKey("n:0");
      else setPrimaryKey(null);
    }
  }

  function removeNewImage(index: number) {
    const newFiles = newImageFiles.filter((_, i) => i !== index);
    const newPreviews = newImagePreviews.filter((_, i) => i !== index);
    setNewImageFiles(newFiles);
    setNewImagePreviews(newPreviews);
    if (primaryKey === `n:${index}`) {
      if (newFiles.length > 0) setPrimaryKey("n:0");
      else if (existingImages.length > 0) setPrimaryKey(`e:${existingImages[0].id}`);
      else setPrimaryKey(null);
    } else if (primaryKey?.startsWith("n:")) {
      const idx = parseInt(primaryKey.slice(2));
      if (idx > index) setPrimaryKey(`n:${idx - 1}`);
    }
  }

  // ── 360 frame handlers ──────────────────────────────────────────────────

  function handleAdd360Frames(files: FileList | null) {
    if (!files || !files.length) return;
    const arr = Array.from(files);
    setNew360Files((prev) => [...prev, ...arr]);
    arr.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => setNew360Previews((prev) => [...prev, e.target?.result as string]);
      reader.readAsDataURL(file);
    });
  }

  function removeNew360Frame(index: number) {
    setNew360Files((prev) => prev.filter((_, i) => i !== index));
    setNew360Previews((prev) => prev.filter((_, i) => i !== index));
  }

  // ── Save ────────────────────────────────────────────────────────────────

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      const price = parseFloat(form.price);
      if (!profile || profile.role !== "admin") {
        throw new Error("Your admin session is not active. Please log in again.");
      }
      if (!Number.isFinite(price) || price <= 0) {
        throw new Error("Please enter a valid item price.");
      }
      if (!form.name.trim()) {
        throw new Error("Please enter an item name.");
      }
      if (!form.metal_id || !form.jewellery_type_id) {
        throw new Error("Please select both metal and jewellery type.");
      }

      const priceDisplay = `₹${price.toLocaleString("en-IN")}`;
      const weightGrams = form.weight_grams ? parseFloat(form.weight_grams) : undefined;

      let itemId: string;
      if (editingItem) {
        await adminUpdateItem(editingItem.id, {
          ...form, price, price_display: priceDisplay,
          weight_grams: weightGrams, collection_ids: form.collection_ids,
        });
        itemId = editingItem.id;
      } else {
        const item = await adminCreateItem({
          ...form, price, price_display: priceDisplay,
          weight_grams: weightGrams, created_by: profile.id,
          collection_ids: form.collection_ids,
        });
        itemId = item.id;
      }

      // Delete marked gallery images
      for (const id of imagesToDelete) {
        const url = editingItem?.item_images?.find((img) => img.id === id)?.url || "";
        await adminDeleteImage(id, url);
      }

      // Set primary among existing gallery images
      if (primaryKey?.startsWith("e:")) {
        await adminSetPrimaryImage(primaryKey.slice(2), itemId);
      }

      // Upload new gallery images
      const galleryOrderBase = Date.now();
      for (let i = 0; i < newImageFiles.length; i++) {
        const isPrimary = primaryKey === `n:${i}`;
        await adminUploadImage(newImageFiles[i], itemId, isPrimary, "gallery", galleryOrderBase + i);
      }

      // Handle 360 frames
      if (replace360 && (existing360Count > 0 || new360Files.length > 0)) {
        await adminDelete360Frames(itemId);
      }
      const frameOrderBase = Date.now() + 1000;
      for (let i = 0; i < new360Files.length; i++) {
        await adminUploadImage(new360Files[i], itemId, false, "360", frameOrderBase + i);
      }

      closeModal();
      getItems().then(setItems);
    } catch (e: any) {
      console.error("[AdminCatalogue] save failed:", e);
      setSaveError(e.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-navy">Catalogue Items ({items.length})</h2>
        <button onClick={openAdd} className="bg-gradient-to-r from-gold to-gold-dark text-navy text-sm font-semibold px-5 py-2.5 rounded-lg">
          + Add Item
        </button>
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
                <td className="px-4 py-3 font-medium text-navy">
                  {it.name}
                  {it.item_images?.some((img) => img.frame_type === "360") && (
                    <span className="ml-2 text-[10px] bg-navy/10 text-navy px-1.5 py-0.5 rounded font-semibold">360°</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500">{it.metals?.name}</td>
                <td className="px-4 py-3 text-gray-500">{it.jewellery_types?.name}</td>
                <td className="px-4 py-3 text-gray-500">{it.weight}</td>
                <td className="px-4 py-3 font-semibold">{it.price_display}</td>
                <td className="px-4 py-3">
                  <button onClick={() => openEdit(it)} className="text-xs text-gold-dark font-medium hover:underline">
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
                    <label className="text-xs font-medium text-gray-600 mb-1 block">
                      Purity <span className="text-gray-400 font-normal">(kt for gold · fineness for silver)</span>
                    </label>
                    <input
                      placeholder="e.g. 22 kt, 18 kt, 925, 999"
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
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Weight</label>
                    <div className="flex items-center rounded-lg border border-gray-200 focus-within:border-gold transition-colors overflow-hidden">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="e.g. 4.2"
                        value={form.weight_grams}
                        onChange={(e) => {
                          const weight_grams = e.target.value;
                          const weight = weight_grams ? `${weight_grams} g` : "";
                          const computed = computePrice(weight_grams, form.purity);
                          setForm({ ...form, weight_grams, weight, ...(computed ? { price: computed } : {}) });
                          if (computed) setPriceAutoCalc(true);
                        }}
                        className="flex-1 px-3 py-2.5 text-sm outline-none bg-white"
                      />
                      <span className="px-3 py-2.5 text-sm font-medium text-gray-400 bg-gray-50 border-l border-gray-200 select-none">g</span>
                    </div>
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
                      onClick={() => setForm((f) => ({
                        ...f,
                        collection_ids: f.collection_ids.includes(c.id)
                          ? f.collection_ids.filter((x: number) => x !== c.id)
                          : [...f.collection_ids, c.id],
                      }))}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        form.collection_ids.includes(c.id)
                          ? "bg-gold text-navy border-gold"
                          : "border-gray-200 text-gray-500 hover:border-gold/50"
                      }`}
                    >
                      {form.collection_ids.includes(c.id) && <span className="mr-1">✓</span>}{c.name}
                    </button>
                  ))}
                </div>
              </section>

              {/* Gallery Images */}
              <section>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Gallery Images</h4>
                <p className="text-[11px] text-gray-400 mb-3">★ = primary photo shown first in catalogue</p>

                {(existingImages.length > 0 || newImagePreviews.length > 0) && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {existingImages.map((img) => (
                      <div key={img.id} className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 group flex-shrink-0">
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-between p-1">
                          <button
                            type="button"
                            onClick={() => setPrimaryKey(`e:${img.id}`)}
                            className={`text-base leading-none ${primaryKey === `e:${img.id}` ? "text-gold" : "text-white/80 hover:text-gold"}`}
                            title="Set as primary"
                          >★</button>
                          <button
                            type="button"
                            onClick={() => removeExistingImage(img.id)}
                            className="text-white/80 hover:text-red-400 text-xs font-bold"
                          >✕</button>
                        </div>
                        {primaryKey === `e:${img.id}` && (
                          <div className="absolute bottom-0 inset-x-0 bg-gold/90 text-navy text-[9px] text-center font-bold py-0.5">PRIMARY</div>
                        )}
                      </div>
                    ))}

                    {newImagePreviews.map((src, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-blue-300 group flex-shrink-0">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-between p-1">
                          <button
                            type="button"
                            onClick={() => setPrimaryKey(`n:${i}`)}
                            className={`text-base leading-none ${primaryKey === `n:${i}` ? "text-gold" : "text-white/80 hover:text-gold"}`}
                            title="Set as primary"
                          >★</button>
                          <button
                            type="button"
                            onClick={() => removeNewImage(i)}
                            className="text-white/80 hover:text-red-400 text-xs font-bold"
                          >✕</button>
                        </div>
                        {primaryKey === `n:${i}` && (
                          <div className="absolute bottom-0 inset-x-0 bg-gold/90 text-navy text-[9px] text-center font-bold py-0.5">PRIMARY</div>
                        )}
                        <div className="absolute top-0 inset-x-0 bg-blue-500/80 text-white text-[9px] text-center py-0.5">NEW</div>
                      </div>
                    ))}
                  </div>
                )}

                <label className="block cursor-pointer">
                  <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleAddGalleryImages(e.target.files)} />
                  <div className="border-2 border-dashed border-gray-200 rounded-xl h-24 flex flex-col items-center justify-center gap-1.5 hover:border-gold/50 transition-colors">
                    <span className="text-xl">📷</span>
                    <span className="text-sm text-gray-400">
                      {existingImages.length + newImagePreviews.length > 0 ? "Add more images" : "Click to upload images"}
                    </span>
                    <span className="text-xs text-gray-300">JPG, PNG, WEBP · Multiple allowed</span>
                  </div>
                </label>
              </section>

              {/* 360° Frames */}
              <section>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">360° View Frames</h4>
                  {existing360Count > 0 && (
                    <span className="text-[11px] text-navy font-medium">{existing360Count} frames uploaded</span>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 mb-3">Upload 24–36 frames taken at equal angles around the piece for a smooth 360° experience.</p>

                {existing360Count > 0 && (
                  <label className="flex items-center gap-2 mb-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={replace360}
                      onChange={(e) => setReplace360(e.target.checked)}
                      className="rounded border-gray-300 text-gold"
                    />
                    <span className="text-xs text-gray-600">Replace all existing 360° frames with new upload</span>
                  </label>
                )}

                {new360Previews.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap mb-3">
                    {new360Previews.map((src, i) => (
                      <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200 group flex-shrink-0">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeNew360Frame(i)}
                          className="absolute inset-0 bg-black/50 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold"
                        >✕</button>
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] text-center py-0.5">{i + 1}</div>
                      </div>
                    ))}
                    <div className="flex items-center justify-center text-xs text-gray-400 font-medium w-14 h-14">
                      {new360Previews.length} frames
                    </div>
                  </div>
                )}

                <label className="block cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleAdd360Frames(e.target.files)}
                  />
                  <div className="border-2 border-dashed border-gray-200 rounded-xl h-24 flex flex-col items-center justify-center gap-1.5 hover:border-gold/50 transition-colors">
                    <span className="text-xl">🔄</span>
                    <span className="text-sm text-gray-400">
                      {new360Files.length > 0 ? `${new360Files.length} frames selected — add more?` : "Upload 360° frames"}
                    </span>
                    <span className="text-xs text-gray-300">Select all frames at once · 24–36 recommended</span>
                  </div>
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
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 rounded-b-2xl">
              {saveError && (
                <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs">
                  {saveError}
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={closeModal} className="flex-1 py-2.5 rounded-lg bg-gray-100 text-gray-600 font-medium text-sm hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!form.name || !form.price || !form.metal_id || !form.jewellery_type_id || saving}
                  className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold text-sm disabled:opacity-40 transition-opacity"
                >
                  {saving ? "Saving…" : editingItem ? "Save Changes" : "Add Item"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

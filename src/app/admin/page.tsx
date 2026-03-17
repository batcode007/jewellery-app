"use client";
import { useEffect, useState } from "react";
import { getItems, getMetals, getJewelleryTypes, getCollections, adminCreateItem, adminUploadImage } from "@/lib/api";
import type { Item } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export default function AdminCatalogue() {
  const { profile } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [metals, setMetals] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", metal_id: 1, jewellery_type_id: 1, weight: "", purity: "", price: "", price_display: "", collection_ids: [] as number[] });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getItems().then(setItems);
    getMetals().then(setMetals);
    getJewelleryTypes().then(setTypes);
    getCollections().then(setCollections);
  }, []);

  async function handleAdd() {
    setSaving(true);
    try {
      const item = await adminCreateItem({
        ...form,
        price: parseFloat(form.price),
        created_by: profile?.id || "",
        collection_ids: form.collection_ids,
      });
      if (imageFile && item) {
        await adminUploadImage(imageFile, item.id);
      }
      setShowAdd(false);
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
        <button onClick={() => setShowAdd(true)} className="bg-gradient-to-r from-gold to-gold-dark text-navy text-sm font-semibold px-5 py-2.5 rounded-lg">+ Add Item</button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              {["Item", "Metal", "Type", "Weight", "Price"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.slice(0, 20).map((it) => (
              <tr key={it.id} className="border-t border-gray-50">
                <td className="px-4 py-3 font-medium text-navy">{it.name}</td>
                <td className="px-4 py-3 text-gray-500">{it.metals?.name}</td>
                <td className="px-4 py-3 text-gray-500">{it.jewellery_types?.name}</td>
                <td className="px-4 py-3 text-gray-500">{it.weight}</td>
                <td className="px-4 py-3 font-semibold">{it.price_display}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Item Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowAdd(false)} />
          <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-auto">
            <h3 className="text-lg font-bold text-navy mb-4">Add New Item</h3>
            <div className="grid gap-3">
              <input placeholder="Item Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none" />
              <div className="grid grid-cols-3 gap-3">
                <select value={form.metal_id} onChange={(e) => setForm({ ...form, metal_id: +e.target.value })} className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm">
                  {metals.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                <select value={form.jewellery_type_id} onChange={(e) => setForm({ ...form, jewellery_type_id: +e.target.value })} className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm">
                  {types.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <input placeholder="Purity (22K)" value={form.purity} onChange={(e) => setForm({ ...form, purity: e.target.value })} className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <input placeholder="Weight (4.2g)" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none" />
                <input placeholder="Price (18500)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none" />
                <input placeholder="Display (₹18,500)" value={form.price_display} onChange={(e) => setForm({ ...form, price_display: e.target.value })} className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Collections</label>
                <div className="flex flex-wrap gap-2">
                  {collections.map((c) => (
                    <button key={c.id} onClick={() => setForm((f) => ({ ...f, collection_ids: f.collection_ids.includes(c.id) ? f.collection_ids.filter((x: number) => x !== c.id) : [...f.collection_ids, c.id] }))}
                      className={`px-3 py-1 rounded-full text-xs border ${form.collection_ids.includes(c.id) ? "bg-gold text-navy border-gold" : "border-gray-200 text-gray-500"}`}>
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
              <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none resize-y" />
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Image</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="text-sm" />
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 rounded-lg bg-gray-100 text-gray-600 font-medium text-sm">Cancel</button>
                <button onClick={handleAdd} disabled={!form.name || !form.price || saving} className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold text-sm disabled:opacity-50">
                  {saving ? "Saving..." : "Add Item"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

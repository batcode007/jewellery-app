"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { submitFeedback } from "@/lib/api";

export default function FeedbackContent() {
  const { profile } = useAuth();
  const [type, setType] = useState("feedback");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!message.trim()) return;
    setLoading(true);
    try {
      await submitFeedback({
        user_id: profile?.id,
        name: profile?.name || undefined,
        phone: profile?.phone || undefined,
        type,
        message: message.trim(),
      });
      setSubmitted(true);
    } catch {
      alert("Failed to submit. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="py-5 pb-10 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-navy mb-1">We&apos;d Love to Hear From You</h1>
      <p className="text-gray-500 text-sm mb-6">Your feedback helps us improve</p>

      {submitted ? (
        <div className="bg-white rounded-xl p-10 text-center border border-gray-200">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4 text-2xl">✅</div>
          <h2 className="text-xl font-bold text-navy mb-2">Thank You!</h2>
          <p className="text-gray-500 text-sm mb-5">We&apos;ve received your {type} and will get back to you soon.</p>
          <button
            onClick={() => { setSubmitted(false); setMessage(""); }}
            className="bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold px-6 py-3 rounded-lg text-sm"
          >
            Submit Another
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="mb-4">
            <label className="text-xs text-gray-400 font-medium mb-2 block">Type</label>
            <div className="flex gap-2">
              {["feedback", "suggestion", "complaint"].map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium capitalize ${
                    type === t ? "border-gold bg-gold/10 text-gold-dark" : "border-gray-200 text-gray-500"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="text-xs text-gray-400 font-medium mb-2 block">Your Message</label>
            <textarea
              placeholder="Tell us what's on your mind..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-gold resize-y"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!message.trim() || loading}
            className="w-full bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? "Submitting..." : `Submit ${type.charAt(0).toUpperCase() + type.slice(1)}`}
          </button>
        </div>
      )}
    </div>
  );
}

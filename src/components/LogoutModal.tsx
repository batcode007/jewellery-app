"use client";

import { LogOut } from "lucide-react";
import ModalBackdrop from "./ModalBackdrop";

interface LogoutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ open, onClose, onConfirm }: LogoutModalProps) {
  return (
    <ModalBackdrop open={open} onClose={onClose}>
      <div className="w-[420px] rounded-xl bg-white shadow-2xl overflow-hidden flex flex-col">
        <div className="flex flex-col items-center gap-4 p-7 pb-5">
          <div className="w-14 h-14 rounded-full bg-bg-gold-light flex items-center justify-center">
            <LogOut size={24} className="text-border-gold" />
          </div>
          <h2 className="font-serif text-lg font-semibold text-text-primary">Logout?</h2>
          <p className="text-sm text-text-secondary text-center leading-relaxed">
            Are you sure you want to logout? You will need to sign in again to access your account.
          </p>
        </div>
        <div className="flex gap-3 p-7 pt-4">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-lg border border-border-light text-sm font-medium text-text-primary flex items-center justify-center cursor-pointer hover:bg-bg-surface-alt active:scale-95 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className="flex-1 h-11 rounded-lg bg-bg-gold text-sm font-medium text-white flex items-center justify-center cursor-pointer hover:brightness-110 active:scale-95 transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

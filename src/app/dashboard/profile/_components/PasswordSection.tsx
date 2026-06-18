"use client";

import { useState } from "react";
import { Lock } from "lucide-react";

import { profileService } from "@/services/profile.service";
import SectionHeader from "./SectionHeader";
import SuccessBanner from "./SuccessBanner";
import SectionError from "./SectionError";
import PwField from "./PwField";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Failed to change password. Please try again.";
}

export default function PasswordSection() {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const reset = () => { setForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); setError(""); };

  const handleSave = async () => {
    if (!form.currentPassword || !form.newPassword) { setError("All fields are required."); return; }
    if (form.newPassword.length < 8) { setError("New password must be at least 8 characters."); return; }
    if (form.newPassword !== form.confirmPassword) { setError("New passwords do not match."); return; }
    setSaving(true); setError("");
    try {
      await profileService.changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      setEditing(false);
      reset();
      setSuccess("Password changed successfully.");
      setTimeout(() => setSuccess(""), 5000);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
      <SectionHeader
        title="Security"
        subtitle="Change your account password"
        editing={editing}
        saving={saving}
        onEdit={() => setEditing(true)}
        onSave={handleSave}
        onCancel={() => { setEditing(false); reset(); }}
      />

      {success && <div className="mt-4"><SuccessBanner message={success} onDismiss={() => setSuccess("")} /></div>}
      {error && <div className="mt-4"><SectionError message={error} /></div>}

      {!editing ? (
        <div className="mt-5 flex items-center gap-3 rounded-xl bg-gray-50 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-light)]">
            <Lock size={18} className="text-[var(--primary)]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--heading)]">Password</p>
            <p className="text-xs text-[var(--text-light)]">Last changed: unknown. Keep your account secure.</p>
          </div>
          <div className="ml-auto flex items-center gap-1 text-xs font-medium text-[var(--text-light)]">
            ••••••••
          </div>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <PwField
              label="Current Password"
              value={form.currentPassword}
              show={showCurrent}
              onToggle={() => setShowCurrent((p) => !p)}
              onChange={(v) => setForm((p) => ({ ...p, currentPassword: v }))}
            />
          </div>
          <PwField
            label="New Password"
            value={form.newPassword}
            show={showNew}
            onToggle={() => setShowNew((p) => !p)}
            onChange={(v) => setForm((p) => ({ ...p, newPassword: v }))}
          />
          <PwField
            label="Confirm New Password"
            value={form.confirmPassword}
            show={showConfirm}
            onToggle={() => setShowConfirm((p) => !p)}
            onChange={(v) => setForm((p) => ({ ...p, confirmPassword: v }))}
          />
          {form.newPassword && form.newPassword.length < 8 && (
            <p className="sm:col-span-2 text-xs text-amber-500">Password must be at least 8 characters.</p>
          )}
        </div>
      )}
    </div>
  );
}

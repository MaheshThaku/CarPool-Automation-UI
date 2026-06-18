"use client";

import { useState } from "react";
import { User, Mail, Phone, Calendar, CheckCircle } from "lucide-react";

import { profileService } from "@/services/profile.service";
import { ProfileData, UpdateProfileRequest } from "@/types/profile.types";
import Field from "./Field";
import SectionHeader from "./SectionHeader";
import SuccessBanner from "./SuccessBanner";
import SectionError from "./SectionError";

function formFromProfile(profile: ProfileData): UpdateProfileRequest {
  return {
    firstName: profile.firstName,
    lastName: profile.lastName,
    bio: profile.bio ?? "",
    dateOfBirth: profile.dateOfBirth ?? "",
  };
}

interface PersonalInfoSectionProps {
  profile: ProfileData;
  onSaved: (updated: ProfileData) => void;
}

export default function PersonalInfoSection({ profile, onSaved }: PersonalInfoSectionProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState<UpdateProfileRequest>(formFromProfile(profile));

  // Re-derive the editable form whenever a fresh `profile` arrives (e.g.
  // after a refetch). Compared during render instead of in a useEffect:
  // React applies this synchronously before the new render is shown, with
  // no extra commit/flicker.
  const [syncedProfile, setSyncedProfile] = useState(profile);
  if (profile !== syncedProfile) {
    setSyncedProfile(profile);
    setForm(formFromProfile(profile));
  }

  const handleChange = (name: string, val: string) =>
    setForm((prev) => ({ ...prev, [name]: val }));

  const handleCancel = () => {
    setForm(formFromProfile(profile));
    setEditing(false);
    setError("");
  };

  const handleSave = async () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("First and last name are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const updated = await profileService.updateProfile(form);
      onSaved(updated);
      setEditing(false);
      setSuccess("Profile updated successfully.");
      setTimeout(() => setSuccess(""), 4000);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
      <SectionHeader
        title="Personal Information"
        subtitle="Your basic account details"
        editing={editing}
        saving={saving}
        onEdit={() => setEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      {success && <div className="mt-4"><SuccessBanner message={success} onDismiss={() => setSuccess("")} /></div>}
      {error && <div className="mt-4"><SectionError message={error} /></div>}

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="First Name" name="firstName" value={form.firstName} editing={editing} icon={User} onChange={handleChange} />
        <Field label="Last Name" name="lastName" value={form.lastName} editing={editing} icon={User} onChange={handleChange} />
        <Field
          label="Email Address" name="email" value={profile.email} editing={editing}
          icon={Mail} onChange={handleChange} readOnly
          badge={
            profile.emailVerified
              ? <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700"><CheckCircle size={11} />Verified</span>
              : <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-600">Unverified</span>
          }
        />
        <Field
          label="Contact Number" name="contactNumber" value={profile.contactNumber} editing={editing}
          icon={Phone} onChange={() => {}} readOnly
          badge={
            profile.contactVerified
              ? <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700"><CheckCircle size={11} />Verified</span>
              : <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-600">Unverified</span>
          }
        />
        <Field
          label="Gender" name="gender" value={profile.gender} editing={editing}
          icon={User} onChange={() => {}} readOnly
        />
        <Field label="Date of Birth" name="dateOfBirth" value={form.dateOfBirth ?? ""} editing={editing} icon={Calendar} onChange={handleChange} type="date" />
      </div>

      <div className="mt-4 space-y-1.5">
        <label className="text-xs font-medium text-[var(--text-light)]">Bio</label>
        {editing ? (
          <textarea
            name="bio"
            value={form.bio ?? ""}
            onChange={(e) => handleChange("bio", e.target.value)}
            rows={3}
            placeholder="Tell other riders a bit about yourself"
            className="w-full rounded-xl border border-[var(--border)] bg-white p-3 text-sm text-[var(--heading)] outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
          />
        ) : (
          <div className="w-full rounded-xl border border-[var(--border)] bg-gray-50 p-3 text-sm">
            <span className={profile.bio ? "text-[var(--heading)]" : "text-[var(--text-light)]"}>
              {profile.bio || "—"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

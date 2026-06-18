"use client";

import { useRef, useState } from "react";
import { Camera, RefreshCw } from "lucide-react";

import { profileService } from "@/services/profile.service";
import { ProfileData } from "@/types/profile.types";

function initials(p: ProfileData | null) {
  if (!p) return "?";
  return ((p.firstName?.[0] ?? "") + (p.lastName?.[0] ?? "")).toUpperCase() || "?";
}

interface AvatarSectionProps {
  profile: ProfileData | null;
  onAvatarChange: (url: string) => void;
}

export default function AvatarSection({ profile, onAvatarChange }: AvatarSectionProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("Photo must be under 5 MB."); return; }
    if (!file.type.startsWith("image/")) { setError("Please select an image file."); return; }

    setError("");
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const res = await profileService.uploadAvatar(file);
      onAvatarChange(res.avatarUrl);
      setPreview(null);
    } catch {
      setError("Upload failed. Please try again.");
      setPreview(null);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const src = preview || profile?.avatarUrl;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[var(--primary)] shadow-md">
          {src ? (
            <img src={src} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            <span className="text-3xl font-bold text-white">{initials(profile)}</span>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
              <RefreshCw size={20} className="animate-spin text-white" />
            </div>
          )}
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[var(--primary)] text-white shadow transition-all hover:bg-[var(--primary-hover)] disabled:opacity-50"
        >
          <Camera size={14} />
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      {profile && (
        <div className="text-center">
          <p className="font-semibold text-[var(--heading)]">{profile.firstName} {profile.lastName}</p>
          <p className="text-xs text-[var(--text-light)]">{profile.email}</p>
        </div>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Car,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Camera,
  Save,
  X,
  Edit2,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAsyncData } from '@/hooks/useAsyncData';
import { profileService } from '@/services/profile.service';
import {
  ProfileData,
  UpdateProfileRequest,
  VehicleData,
  UpdateVehicleRequest,
  Gender,
} from '@/types/profile.types';

/* =====================================================================
   Utilities
===================================================================== */

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

function initials(p: ProfileData | null) {
  if (!p) return '?';
  return (
    ((p.firstName?.[0] ?? '') + (p.lastName?.[0] ?? '')).toUpperCase() || '?'
  );
}

/* =====================================================================
   Shared primitives
===================================================================== */

function Skeleton({ className }: { className: string }) {
  return (
    <div className={'animate-pulse rounded-xl bg-gray-100 ' + className} />
  );
}

function SectionError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-600">
      <AlertCircle size={16} className="shrink-0" />
      <span className="flex-1">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1 font-medium hover:underline"
        >
          <RefreshCw size={13} /> Retry
        </button>
      )}
    </div>
  );
}

function SuccessBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-green-50 p-4 text-sm text-green-700">
      <CheckCircle size={16} className="shrink-0" />
      <span className="flex-1">{message}</span>
      <button onClick={onDismiss}>
        <X size={14} />
      </button>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  editing: boolean;
  icon?: React.ElementType;
  type?: string;
  name: string;
  onChange: (name: string, val: string) => void;
  readOnly?: boolean;
  badge?: React.ReactNode;
  options?: { value: string; label: string }[];
}

function Field({
  label,
  value,
  editing,
  icon: Icon,
  type = 'text',
  name,
  onChange,
  readOnly,
  badge,
  options,
}: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-[var(--text-light)]">
        {label}
      </label>
      <div className="relative flex items-center">
        {Icon && (
          <div className="pointer-events-none absolute left-3 flex h-full items-center">
            <Icon size={15} className="text-[var(--text-light)]" />
          </div>
        )}
        {editing && !readOnly ? (
          options ? (
            <select
              name={name}
              value={value}
              onChange={(e) => onChange(name, e.target.value)}
              className={cn(
                'w-full rounded-xl border border-[var(--border)] bg-white py-2.5 pr-3 text-sm text-[var(--heading)] transition-all outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20',
                Icon ? 'pl-9' : 'pl-3',
              )}
            >
              {options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              name={name}
              value={value}
              onChange={(e) => onChange(name, e.target.value)}
              className={cn(
                'w-full rounded-xl border border-[var(--border)] bg-white py-2.5 pr-3 text-sm text-[var(--heading)] transition-all outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20',
                Icon ? 'pl-9' : 'pl-3',
              )}
            />
          )
        ) : (
          <div
            className={cn(
              'flex w-full items-center rounded-xl border border-[var(--border)] bg-gray-50 py-2.5 pr-3 text-sm',
              Icon ? 'pl-9' : 'pl-3',
            )}
          >
            <span
              className={
                value ? 'text-[var(--heading)]' : 'text-[var(--text-light)]'
              }
            >
              {value || '—'}
            </span>
            {badge && <span className="ml-auto">{badge}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  editing,
  saving,
  onEdit,
  onSave,
  onCancel,
}: {
  title: string;
  subtitle: string;
  editing: boolean;
  saving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h3 className="font-semibold text-[var(--heading)]">{title}</h3>
        <p className="mt-0.5 text-xs text-[var(--text-light)]">{subtitle}</p>
      </div>
      {editing ? (
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text)] hover:bg-gray-50 disabled:opacity-50"
          >
            <X size={13} /> Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-xl bg-[var(--primary)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--primary-hover)] disabled:opacity-60"
          >
            {saving ? (
              <RefreshCw size={13} className="animate-spin" />
            ) : (
              <Save size={13} />
            )}
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      ) : (
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text)] hover:bg-gray-50"
        >
          <Edit2 size={13} /> Edit
        </button>
      )}
    </div>
  );
}

/* =====================================================================
   Avatar Section
===================================================================== */

function AvatarSection({
  profile,
  onAvatarChange,
}: {
  profile: ProfileData | null;
  onAvatarChange: (url: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Photo must be under 5 MB.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const res = await profileService.uploadAvatar(file);
      onAvatarChange(res.avatarUrl);
      setPreview(null);
    } catch {
      setError('Upload failed. Please try again.');
      setPreview(null);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const src = preview || profile?.avatarUrl;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[var(--primary)] shadow-md">
          {src ? (
            <img
              src={src}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-3xl font-bold text-white">
              {initials(profile)}
            </span>
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
          className="absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[var(--primary)] text-white shadow transition-all hover:bg-[var(--primary-hover)] disabled:opacity-50"
        >
          <Camera size={14} />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
      </div>
      {profile && (
        <div className="text-center">
          <p className="font-semibold text-[var(--heading)]">
            {profile.firstName} {profile.lastName}
          </p>
          <p className="text-xs text-[var(--text-light)]">{profile.email}</p>
        </div>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

/* =====================================================================
   Personal Info Section
===================================================================== */

function PersonalInfoSection({
  profile,
  onSaved,
}: {
  profile: ProfileData;
  onSaved: (updated: ProfileData) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState<UpdateProfileRequest>({
    firstName: profile.firstName,
    lastName: profile.lastName,
    contactNumber: profile.contactNumber,
    gender: profile.gender,
    dateOfBirth: profile.dateOfBirth ?? '',
  });

  useEffect(() => {
    setForm({
      firstName: profile.firstName,
      lastName: profile.lastName,
      contactNumber: profile.contactNumber,
      gender: profile.gender,
      dateOfBirth: profile.dateOfBirth ?? '',
    });
  }, [profile]);

  const handleChange = (name: string, val: string) =>
    setForm((prev) => ({ ...prev, [name]: val }));

  const handleCancel = () => {
    setForm({
      firstName: profile.firstName,
      lastName: profile.lastName,
      contactNumber: profile.contactNumber,
      gender: profile.gender,
      dateOfBirth: profile.dateOfBirth ?? '',
    });
    setEditing(false);
    setError('');
  };

  const handleSave = async () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError('First and last name are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const updated = await profileService.updateProfile(form);
      onSaved(updated);
      setEditing(false);
      setSuccess('Profile updated successfully.');
      setTimeout(() => setSuccess(''), 4000);
    } catch {
      setError('Failed to save. Please try again.');
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

      {success && (
        <div className="mt-4">
          <SuccessBanner message={success} onDismiss={() => setSuccess('')} />
        </div>
      )}
      {error && (
        <div className="mt-4">
          <SectionError message={error} />
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="First Name"
          name="firstName"
          value={form.firstName}
          editing={editing}
          icon={User}
          onChange={handleChange}
        />
        <Field
          label="Last Name"
          name="lastName"
          value={form.lastName}
          editing={editing}
          icon={User}
          onChange={handleChange}
        />
        <Field
          label="Email Address"
          name="email"
          value={profile.email}
          editing={editing}
          icon={Mail}
          onChange={handleChange}
          readOnly
          badge={
            profile.emailVerified ? (
              <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                <CheckCircle size={11} />
                Verified
              </span>
            ) : (
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
                Unverified
              </span>
            )
          }
        />
        <Field
          label="Contact Number"
          name="contactNumber"
          value={form.contactNumber}
          editing={editing}
          icon={Phone}
          onChange={handleChange}
          type="tel"
          badge={
            !editing &&
            (profile.contactVerified ? (
              <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                <CheckCircle size={11} />
                Verified
              </span>
            ) : (
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
                Unverified
              </span>
            ))
          }
        />
        <Field
          label="Gender"
          name="gender"
          value={form.gender}
          editing={editing}
          icon={User}
          onChange={handleChange}
          options={[
            { value: 'MALE', label: 'Male' },
            { value: 'FEMALE', label: 'Female' },
            { value: 'OTHER', label: 'Other' },
          ]}
        />
        <Field
          label="Date of Birth"
          name="dateOfBirth"
          value={form.dateOfBirth ?? ''}
          editing={editing}
          icon={Calendar}
          onChange={handleChange}
          type="date"
        />
      </div>
    </div>
  );
}

/* =====================================================================
   Vehicle Section (Rider only)
===================================================================== */

const VEHICLE_TYPES = [
  'SEDAN',
  'SUV',
  'HATCHBACK',
  'TRUCK',
  'VAN',
  'MOTORCYCLE',
  'OTHER',
];

function VehicleSection() {
  const vehicle$ = useAsyncData(() => profileService.getVehicle());
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState<UpdateVehicleRequest>({
    model: '',
    registrationNumber: '',
    color: '',
    vehicleType: 'SEDAN',
    yearOfManufacture: undefined,
  });

  const syncForm = (v: VehicleData | null) => {
    if (!v) return;
    setForm({
      model: v.model,
      registrationNumber: v.registrationNumber,
      color: v.color,
      vehicleType: v.vehicleType,
      yearOfManufacture: v.yearOfManufacture,
    });
  };

  useEffect(() => {
    syncForm(vehicle$.data);
  }, [vehicle$.data]);

  const handleChange = (name: string, val: string) =>
    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'yearOfManufacture' ? (val ? Number(val) : undefined) : val,
    }));

  const handleCancel = () => {
    syncForm(vehicle$.data);
    setEditing(false);
    setError('');
  };

  const handleSave = async () => {
    if (!form.model.trim() || !form.registrationNumber.trim()) {
      setError('Model and registration number are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const existing = vehicle$.data;
      if (existing?.id) {
        await profileService.updateVehicle(existing.id, form);
      } else {
        await profileService.createVehicle(form);
      }
      vehicle$.refetch();
      setEditing(false);
      setSuccess('Vehicle details saved.');
      setTimeout(() => setSuccess(''), 4000);
    } catch {
      setError('Failed to save vehicle. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (vehicle$.loading) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
        <Skeleton className="mb-4 h-5 w-40" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
      <SectionHeader
        title="Vehicle Information"
        subtitle="Details about your vehicle for passengers"
        editing={editing}
        saving={saving}
        onEdit={() => {
          syncForm(vehicle$.data);
          setEditing(true);
        }}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      {success && (
        <div className="mt-4">
          <SuccessBanner message={success} onDismiss={() => setSuccess('')} />
        </div>
      )}
      {error && (
        <div className="mt-4">
          <SectionError message={error} />
        </div>
      )}
      {vehicle$.error && !editing && (
        <div className="mt-4">
          <SectionError message={vehicle$.error} onRetry={vehicle$.refetch} />
        </div>
      )}

      {!vehicle$.data && !editing ? (
        <div className="mt-6 flex flex-col items-center py-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <Car size={22} className="text-gray-400" />
          </div>
          <p className="mt-3 font-medium text-[var(--heading)]">
            No vehicle added yet
          </p>
          <p className="mt-1 text-sm text-[var(--text-light)]">
            Add your vehicle to start offering rides.
          </p>
          <button
            onClick={() => setEditing(true)}
            className="mt-4 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]"
          >
            Add Vehicle
          </button>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Vehicle Model"
            name="model"
            value={form.model}
            editing={editing}
            icon={Car}
            onChange={handleChange}
          />
          <Field
            label="Registration Number"
            name="registrationNumber"
            value={form.registrationNumber}
            editing={editing}
            icon={Car}
            onChange={handleChange}
          />
          <Field
            label="Color"
            name="color"
            value={form.color}
            editing={editing}
            onChange={handleChange}
          />
          <Field
            label="Vehicle Type"
            name="vehicleType"
            value={form.vehicleType}
            editing={editing}
            onChange={handleChange}
            options={VEHICLE_TYPES.map((t) => ({
              value: t,
              label: t.charAt(0) + t.slice(1).toLowerCase(),
            }))}
          />
          <Field
            label="Year of Manufacture"
            name="yearOfManufacture"
            value={form.yearOfManufacture ? String(form.yearOfManufacture) : ''}
            editing={editing}
            onChange={handleChange}
            type="number"
          />
        </div>
      )}
    </div>
  );
}

/* =====================================================================
   Change Password Section
===================================================================== */

function PasswordSection() {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const reset = () => {
    setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setError('');
  };

  const handleSave = async () => {
    if (!form.currentPassword || !form.newPassword) {
      setError('All fields are required.');
      return;
    }
    if (form.newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await profileService.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setEditing(false);
      reset();
      setSuccess('Password changed successfully.');
      setTimeout(() => setSuccess(''), 5000);
    } catch {
      setError('Current password is incorrect or request failed.');
    } finally {
      setSaving(false);
    }
  };

  function PwField({
    label,
    field,
    show,
    onToggle,
  }: {
    label: string;
    field: keyof typeof form;
    show: boolean;
    onToggle: () => void;
  }) {
    return (
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-[var(--text-light)]">
          {label}
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
            <Lock size={15} className="text-[var(--text-light)]" />
          </div>
          <input
            type={show ? 'text' : 'password'}
            value={form[field]}
            onChange={(e) =>
              setForm((p) => ({ ...p, [field]: e.target.value }))
            }
            placeholder="••••••••"
            className="w-full rounded-xl border border-[var(--border)] bg-white py-2.5 pr-10 pl-9 text-sm text-[var(--heading)] transition-all outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
          />
          <button
            type="button"
            onClick={onToggle}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--text-light)] hover:text-[var(--heading)]"
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
      <SectionHeader
        title="Security"
        subtitle="Change your account password"
        editing={editing}
        saving={saving}
        onEdit={() => setEditing(true)}
        onSave={handleSave}
        onCancel={() => {
          setEditing(false);
          reset();
        }}
      />

      {success && (
        <div className="mt-4">
          <SuccessBanner message={success} onDismiss={() => setSuccess('')} />
        </div>
      )}
      {error && (
        <div className="mt-4">
          <SectionError message={error} />
        </div>
      )}

      {!editing ? (
        <div className="mt-5 flex items-center gap-3 rounded-xl bg-gray-50 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-light)]">
            <Lock size={18} className="text-[var(--primary)]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--heading)]">
              Password
            </p>
            <p className="text-xs text-[var(--text-light)]">
              Last changed: unknown. Keep your account secure.
            </p>
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
              field="currentPassword"
              show={showCurrent}
              onToggle={() => setShowCurrent((p) => !p)}
            />
          </div>
          <PwField
            label="New Password"
            field="newPassword"
            show={showNew}
            onToggle={() => setShowNew((p) => !p)}
          />
          <PwField
            label="Confirm New Password"
            field="confirmPassword"
            show={showConfirm}
            onToggle={() => setShowConfirm((p) => !p)}
          />
          {form.newPassword && form.newPassword.length < 8 && (
            <p className="text-xs text-amber-500 sm:col-span-2">
              Password must be at least 8 characters.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* =====================================================================
   Verification Status Card
===================================================================== */

function VerificationCard({ profile }: { profile: ProfileData }) {
  const items = [
    { label: 'Email Address', verified: profile.emailVerified, icon: Mail },
    { label: 'Phone Number', verified: profile.contactVerified, icon: Phone },
  ];
  const allVerified = items.every((i) => i.verified);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full',
            allVerified ? 'bg-green-50' : 'bg-amber-50',
          )}
        >
          <ShieldCheck
            size={20}
            className={allVerified ? 'text-green-600' : 'text-amber-500'}
          />
        </div>
        <div>
          <h3 className="font-semibold text-[var(--heading)]">
            Account Verification
          </h3>
          <p className="text-xs text-[var(--text-light)]">
            {allVerified
              ? 'Your account is fully verified'
              : 'Complete verification to build trust'}
          </p>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {items.map(({ label, verified, icon: Icon }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100">
                <Icon size={13} className="text-[var(--text-light)]" />
              </div>
              <span className="text-sm text-[var(--text)]">{label}</span>
            </div>
            {verified ? (
              <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                <CheckCircle size={11} /> Verified
              </span>
            ) : (
              <button className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600 hover:bg-amber-100">
                Verify Now
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* =====================================================================
   Page
===================================================================== */

export default function ProfilePage() {
  const currentUser = useCurrentUser();
  const isRider = currentUser?.role === 'ROLE_RIDER';

  const profile$ = useAsyncData(() => profileService.getProfile());
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    if (profile$.data) setProfile(profile$.data);
  }, [profile$.data]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--heading)]">My Profile</h2>
        <p className="mt-1 text-sm text-[var(--text)]">
          Manage your personal details and account settings.
        </p>
      </div>

      {profile$.loading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-[var(--border)] bg-white p-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="h-40 rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
        </div>
      ) : profile$.error ? (
        <SectionError message={profile$.error} onRetry={profile$.refetch} />
      ) : !profile ? null : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          {/* Left column */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
              <AvatarSection
                profile={profile}
                onAvatarChange={(url) =>
                  setProfile((p) => (p ? { ...p, avatarUrl: url } : p))
                }
              />
              <div className="mt-5 space-y-2 border-t border-[var(--border)] pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-light)]">Role</span>
                  <span className="rounded-full bg-[var(--primary-light)] px-2.5 py-0.5 text-xs font-semibold text-[var(--primary)]">
                    {isRider ? 'Rider' : 'Passenger'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-light)]">Member since</span>
                  <span className="text-xs font-medium text-[var(--heading)]">
                    2025
                  </span>
                </div>
              </div>
            </div>

            <VerificationCard profile={profile} />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <PersonalInfoSection
              profile={profile}
              onSaved={(updated) => {
                setProfile(updated);
                // also sync localStorage user name
                try {
                  const stored = window.localStorage.getItem('user');
                  if (stored) {
                    const u = JSON.parse(stored);
                    u.firstName = updated.firstName;
                    u.lastName = updated.lastName;
                    window.localStorage.setItem('user', JSON.stringify(u));
                  }
                } catch {
                  /* ignore */
                }
              }}
            />
            {isRider && <VehicleSection />}
            <PasswordSection />
          </div>
        </div>
      )}
    </div>
  );
}

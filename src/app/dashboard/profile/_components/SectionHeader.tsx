import { Edit2, RefreshCw, Save, X } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  editing: boolean;
  saving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function SectionHeader({
  title, subtitle, editing, saving,
  onEdit, onSave, onCancel,
}: SectionHeaderProps) {
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
            {saving ? <RefreshCw size={13} className="animate-spin" /> : <Save size={13} />}
            {saving ? "Saving…" : "Save"}
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

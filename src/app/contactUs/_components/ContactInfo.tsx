import { Clock3, Mail, MessageCircle, ShieldCheck, Users } from 'lucide-react';

import { CONTACT_DETAILS } from './contact.constants';

export default function ContactInfo() {
  return (
    <div>
      {/* Heading */}
      <h2 className="mt-8 text-5xl leading-tight font-bold text-[var(--heading)] md:text-6xl">
        Need Help?
        <span className="mt-2 block text-[var(--primary)]">
          We&apos;re Here To Assist.
        </span>
      </h2>
      {/* Highlights */}

      <div className="mt-8 space-y-4">
        {CONTACT_DETAILS.highlights.map((item) => (
          <div key={item} className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary-light)]">
              <ShieldCheck size={16} className="text-[var(--primary)]" />
            </div>

            <span className="font-medium text-[var(--heading)]">{item}</span>
          </div>
        ))}
      </div>
      {/* Contact Meta */}

      <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-[var(--primary)]" />

            <span className="text-[var(--text)]">{CONTACT_DETAILS.email}</span>
          </div>

          <div className="flex items-center gap-3">
            <MessageCircle size={18} className="text-[var(--primary)]" />

            <span className="text-[var(--text)]">WhatsApp Support</span>
          </div>

          <div className="flex items-center gap-3">
            <Clock3 size={18} className="text-[var(--primary)]" />

            <span className="text-[var(--text)]">
              {CONTACT_DETAILS.responseTime}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

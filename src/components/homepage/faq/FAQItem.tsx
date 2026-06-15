'use client';

import { useState } from 'react';

import { Plus, Minus } from 'lucide-react';

type Props = {
  question: string;
  answer: string;
};

export default function FAQItem({ question, answer }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-all duration-300 hover:border-[var(--primary)]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-5 text-left"
      >
        <span className="pr-4 text-base font-semibold text-[var(--heading)]">
          {question}
        </span>

        {isOpen ? (
          <Minus size={20} className="text-[var(--primary)]" />
        ) : (
          <Plus size={20} className="text-[var(--primary)]" />
        )}
      </button>

      {isOpen && (
        <div className="border-t border-[var(--border)] px-5 py-4">
          <p className="leading-relaxed text-[var(--text-light)]">{answer}</p>
        </div>
      )}
    </div>
  );
}

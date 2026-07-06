'use client';

import { memo } from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  page: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  prevPage: () => void;
  nextPage: () => void;
}

function PaginationComponent({
  page,
  totalPages,
  hasPrev,
  hasNext,
  prevPage,
  nextPage,
}: Props) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-[var(--text-light)]">
        Page <span className="font-semibold text-[var(--heading)]">{page}</span>
        {' of '}
        <span className="font-semibold text-[var(--heading)]">
          {totalPages}
        </span>
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={!hasPrev}
          onClick={prevPage}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} />
        </button>

        <button
          type="button"
          disabled={!hasNext}
          onClick={nextPage}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

const Pagination = memo(PaginationComponent);

export default Pagination;

'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrev = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };

  const startPage = Math.max(1, page - 2);

  const endPage = Math.min(totalPages, startPage + 4);

  const visiblePages = Array.from(
    {
      length: endPage - startPage + 1,
    },
    (_, index) => startPage + index,
  );

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={handlePrev}
        disabled={page === 1}
        className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-light)] transition-all hover:bg-[var(--primary-light)] hover:text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft size={16} />
      </button>

      {visiblePages.map((pageNo) => (
        <button
          key={pageNo}
          type="button"
          onClick={() => onPageChange(pageNo)}
          className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium transition-all ${
            page === pageNo
              ? 'bg-[var(--primary)] text-white'
              : 'text-[var(--heading)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)]'
          } `}
        >
          {pageNo}
        </button>
      ))}

      <button
        type="button"
        onClick={handleNext}
        disabled={page === totalPages}
        className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-light)] transition-all hover:bg-[var(--primary-light)] hover:text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

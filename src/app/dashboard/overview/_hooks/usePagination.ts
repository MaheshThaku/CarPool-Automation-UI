'use client';

import { useMemo, useState, useEffect } from 'react';

interface Props<T> {
  items: T[];
  pageSize?: number;
}

export function usePagination<T>({
  items,
  pageSize = 5,
}: Props<T>) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(items.length / pageSize),
  );

  useEffect(() => {
    if (page > totalPages) {
      let isMounted = true;

      Promise.resolve().then(() => {
        if (isMounted) {
          setPage(1);
        }
      });

      return () => {
        isMounted = false;
      };
    }

    return undefined;
  }, [page, totalPages]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize;

    return items.slice(
      start,
      start + pageSize,
    );
  }, [items, page, pageSize]);

  return {
    page,
    totalPages,
    paginatedItems,

    hasPrev: page > 1,
    hasNext: page < totalPages,

    prevPage: () =>
      setPage((p) => Math.max(1, p - 1)),

    nextPage: () =>
      setPage((p) =>
        Math.min(totalPages, p + 1),
      ),
  };
}
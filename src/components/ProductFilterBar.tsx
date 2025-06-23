'use client';

import dynamic from 'next/dynamic'
const SlInput = dynamic(
  () =>
    import('@shoelace-style/shoelace/dist/react').then((mod) => mod.SlInput),
  { ssr: false }
);
type ProductFilterBarProps = {
  search: string;
  setSearch: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
  setPage: (value: number) => void;
};

export function ProductFilterBar({ search, setSearch, sort, setSort, setPage }: ProductFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 pb-4">
      <SlInput
        placeholder="Buscar produto..."
        value={search}
        onSlInput={(e: any) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />
      <select
        className="p-2 border rounded"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        style={{ color: 'var(--text-expresso)' }}
      >
        <option value="name">Nome (A-Z)</option>
        <option value="price">Preço (menor primeiro)</option>
      </select>
    </div>
  );
}
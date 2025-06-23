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
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
      <div className="flex-1 min-w-0">
        <SlInput
          placeholder="🔍 Buscar produtos..."
          value={search}
          onSlInput={(e: any) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full"
          size="small"
        />
      </div>
      <div className="flex-shrink-0">
        <select
          className="input w-full sm:w-auto min-w-[160px] text-sm bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="name">📝 Nome (A-Z)</option>
          <option value="price">💰 Preço (menor)</option>
        </select>
      </div>
    </div>
  );
}
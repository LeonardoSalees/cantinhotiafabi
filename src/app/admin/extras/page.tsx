/* app/admin/extras/page.tsx */
'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

/* Shoelace – SSR off */
const SlButton = dynamic(() =>
  import('@shoelace-style/shoelace/dist/react').then(m => m.SlButton), { ssr: false });
const SlDialog = dynamic(() =>
  import('@shoelace-style/shoelace/dist/react').then(m => m.SlDialog), { ssr: false });
const SlInput = dynamic(() =>
  import('@shoelace-style/shoelace/dist/react').then(m => m.SlInput), { ssr: false });

/* ---------- types ---------- */
type Extra = { id: number; name: string; price: number; isFree: boolean };

/* ---------- page ---------- */
export default function AdminExtras() {
  /* state */
  const [extras, setExtras] = useState<Extra[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Extra | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [isFree, setIsFree] = useState(false);

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name'); // ou 'price'
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* fetch list */
  const loadExtras = async () => {
    const res = await fetch(`/api/extras?page=${page}&limit=10&sort=${sort}&search=${search}`);
    const data = await res.json();
    setExtras(data.extras);
    setTotalPages(data.total === 0 ? 1 : data.total);  // Total de páginas (vem do backend)
  };
  useEffect(() => { loadExtras(); }, [page, sort, search]);

  /* open modal (create | edit) */
  const openModal = (extra?: Extra) => {
    if (extra) {
      setEditing(extra);
      setName(extra.name);
      setPrice(extra.price.toString());
      setIsFree(extra.isFree);
    } else {
      setEditing(null);
      setName('');
      setPrice('');
      setIsFree(false);
    }
    setOpen(true);
  };

  /* save (POST | PUT) */
  const handleSave = async () => {
    if (!name || !price) return alert('Preencha nome e preço');
    const body = { name, price: Number(price), isFree };

    const url = editing ? `/api/extras/${editing.id}` : '/api/extras';
    const method = editing ? 'PUT' : 'POST';

    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setOpen(false);
    loadExtras();
  };

  /* delete */
  const handleDelete = async (id: number) => {
    if (!confirm('Excluir este extra?')) return;
    await fetch(`/api/extras/${id}`, { method: 'DELETE' });
    loadExtras();
  };

  /* ---------- UI ---------- */
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4" style={{ color: 'var(--text-expresso)' }}>
      <div className="w-full max-w-xl">
      <div className="flex items-center justify-between mb-4">
          <SlInput
            className="w-1/2"
            placeholder="Buscar produto..."
            value={search}
            onSlInput={(e: any) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <select
            className="ml-4 p-2 border rounded"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="name">Nome (A-Z)</option>
            <option value="price">Preço (menor primeiro)</option>
          </select>
        </div>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gerenciar Extras</h1>
          <SlButton variant="primary" onClick={() => openModal()}>
            Novo Extra
          </SlButton>
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Preço (R$)</th>
                <th className="px-4 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {extras.map(ext => (
                <tr key={ext.id} className="border-t">
                  <td className="px-4 py-3">{ext.name}</td>
                  <td className="px-4 py-3">{ext.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right space-x-2 flex justify-end">
                    <SlButton size="small" onClick={() => openModal(ext)}>Editar</SlButton>
                    <SlButton size="small" variant="danger" onClick={() => handleDelete(ext.id)}>Excluir</SlButton>
                  </td>
                </tr>
              ))}
              {extras.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                    Nenhum extra cadastrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="self-center">Página {page} de {totalPages}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page >= totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Próxima
        </button>
      </div>
      {/* Modal */}
      <SlDialog
        label={editing ? 'Editar Extra' : 'Novo Extra'}
        open={open}
        onSlAfterHide={() => setOpen(false)}
      >
        <div className="space-y-4">
          <SlInput label="Nome" value={name} onSlInput={(e: any) => setName(e.target.value)} />
          <SlInput
            label="Preço"
            type="number"
            min="0"
            step={0.01}
            value={price}
            onSlInput={(e: any) => setPrice(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isFree"
              checked={isFree}
              onChange={(e) => setIsFree(e.target.checked)}
              className="accent-green-600"
            />
            <label htmlFor="isFree">Complemento gratuito</label>
          </div>
        </div>

        <div slot="footer" className="flex gap-2">
          <SlButton variant="default" onClick={() => setOpen(false)}>Cancelar</SlButton>
          <SlButton variant="primary" onClick={handleSave}>Salvar</SlButton>
        </div>
      </SlDialog>
    </main>
  );
}

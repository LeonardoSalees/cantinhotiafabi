
'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MdAdd, MdEdit, MdDelete, MdExtension, MdSearch } from 'react-icons/md';

const SlButton = dynamic(() =>
  import('@shoelace-style/shoelace/dist/react').then(m => m.SlButton), { ssr: false });
const SlDialog = dynamic(() =>
  import('@shoelace-style/shoelace/dist/react').then(m => m.SlDialog), { ssr: false });
const SlInput = dynamic(() =>
  import('@shoelace-style/shoelace/dist/react').then(m => m.SlInput), { ssr: false });

type Extra = { id: number; name: string; price: number; isFree: boolean };

export default function AdminExtras() {
  const [extras, setExtras] = useState<Extra[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Extra | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [isFree, setIsFree] = useState(false);

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadExtras = async () => {
    const res = await fetch(`/api/extras?page=${page}&limit=10&sort=${sort}&search=${search}`);
    const data = await res.json();
    setExtras(data.extras);
    setTotalPages(data.total === 0 ? 1 : data.total);
  };

  useEffect(() => { loadExtras(); }, [page, sort, search]);

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

  const handleSave = async () => {
    if (!name || !price) return alert('Preencha nome e preço');
    const body = { name, price: Number(price), isFree };

    const url = editing ? `/api/extras/${editing.id}` : '/api/extras';
    const method = editing ? 'PUT' : 'POST';

    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setOpen(false);
    loadExtras();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Excluir este extra?')) return;
    await fetch(`/api/extras/${id}`, { method: 'DELETE' });
    loadExtras();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Extras</h1>
              <p className="text-gray-600">Gerencie complementos e adicionais dos produtos</p>
            </div>
            <SlButton variant="primary" onClick={() => openModal()} className="flex items-center gap-2">
              <MdAdd className="text-lg" />
              Novo Extra
            </SlButton>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <SlInput
                placeholder="Buscar extras..."
                value={search}
                onSlInput={(e: any) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors min-w-[160px]"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="name">📝 Nome (A-Z)</option>
              <option value="price">💰 Preço (menor)</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {extras.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <MdExtension className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum extra encontrado</h3>
            <p className="text-gray-500 mb-6">
              {search ? 'Tente ajustar os filtros de busca' : 'Comece criando seu primeiro extra'}
            </p>
            {!search && (
              <SlButton variant="primary" onClick={() => openModal()}>
                Criar Primeiro Extra
              </SlButton>
            )}
          </div>
        ) : (
          <>
            {/* Table for larger screens */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Nome</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Preço</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {extras.map(ext => (
                    <tr key={ext.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-800 font-medium">{ext.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {ext.isFree ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Grátis
                          </span>
                        ) : (
                          `R$ ${ext.price.toFixed(2)}`
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          ext.isFree ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {ext.isFree ? 'Complemento' : 'Pago'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <SlButton size="small" onClick={() => openModal(ext)}>
                          <MdEdit className="mr-1" />
                          Editar
                        </SlButton>
                        <SlButton size="small" variant="danger" onClick={() => handleDelete(ext.id)}>
                          <MdDelete className="mr-1" />
                          Excluir
                        </SlButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards for mobile */}
            <div className="md:hidden space-y-4">
              {extras.map(ext => (
                <div key={ext.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{ext.name}</h3>
                      <p className="text-lg font-bold text-amber-600">
                        {ext.isFree ? 'Grátis' : `R$ ${ext.price.toFixed(2)}`}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      ext.isFree ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {ext.isFree ? 'Complemento' : 'Pago'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <SlButton size="small" onClick={() => openModal(ext)} className="flex-1">
                      <MdEdit className="mr-1" />
                      Editar
                    </SlButton>
                    <SlButton size="small" variant="danger" onClick={() => handleDelete(ext.id)} className="flex-1">
                      <MdDelete className="mr-1" />
                      Excluir
                    </SlButton>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-600">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page >= totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Próxima
            </button>
          </div>
        )}

        {/* Modal */}
        <SlDialog
          label={editing ? 'Editar Extra' : 'Novo Extra'}
          open={open}
          onSlAfterHide={() => setOpen(false)}
        >
          <div className="space-y-6 p-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Extra *</label>
              <SlInput 
                value={name} 
                onSlInput={(e: any) => setName(e.target.value)} 
                placeholder="Ex: Leite condensado, Granola..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preço (R$) *</label>
              <SlInput
                type="number"
                min="0"
                step={0.01}
                value={price}
                onSlInput={(e: any) => setPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="isFree"
                checked={isFree}
                onChange={(e) => setIsFree(e.target.checked)}
                className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
              />
              <label htmlFor="isFree" className="text-sm font-medium text-gray-700">
                Complemento gratuito
              </label>
            </div>
          </div>

          <div slot="footer" className="flex gap-3">
            <SlButton variant="default" onClick={() => setOpen(false)} className="flex-1">
              Cancelar
            </SlButton>
            <SlButton variant="primary" onClick={handleSave} className="flex-1">
              {editing ? 'Atualizar' : 'Criar'}
            </SlButton>
          </div>
        </SlDialog>
      </div>
    </div>
  );
}

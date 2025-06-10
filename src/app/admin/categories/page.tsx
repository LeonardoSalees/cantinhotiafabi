'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import ImageUpload from '@/app/components/ImageUpload';
import Image from 'next/image';

const SlButton = dynamic(
  () => import('@shoelace-style/shoelace/dist/react').then((mod) => mod.SlButton),
  { ssr: false }
);

const SlDialog = dynamic(
  () => import('@shoelace-style/shoelace/dist/react').then((mod) => mod.SlDialog),
  { ssr: false }
);

const SlInput = dynamic(
  () => import('@shoelace-style/shoelace/dist/react').then((mod) => mod.SlInput),
  { ssr: false }
);

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
};

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/categories?page=${currentPage}&search=${search}`);
      const data = await res.json();
      setCategories(data.categories);
      setTotalPages(data.pages);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage, search]);

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setName(category.name);
      setDescription(category.description || '');
      setImageUrl(category.imageUrl || '');
    } else {
      setEditingCategory(null);
      setName('');
      setDescription('');
      setImageUrl('');
    }
    setOpen(true);
  };

  const handleSave = async () => {
    if (!name) return alert('Preencha o nome da categoria');

    const body = { 
      name, 
      description,
      imageUrl
    };

    try {
      if (editingCategory) {
        const response = await fetch(`/api/categories/${editingCategory.slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Erro ao atualizar categoria');
        }
      } else {
        const response = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Erro ao criar categoria');
        }
      }

      setOpen(false);
      fetchCategories();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao salvar categoria');
    }
  };

  const handleDelete = async (category: Category) => {
    if (!confirm('Tem certeza? Esta ação não pode ser desfeita.')) return;
    
    try {
      const response = await fetch(`/api/categories/${category.slug}`, { 
        method: 'DELETE' 
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao excluir categoria');
      }
      
      fetchCategories();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao excluir categoria');
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4" style={{color: 'var(--text-expresso)'}}>
      <div className="w-full max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gerenciar Categorias</h1>
          <SlButton variant="primary" onClick={() => openModal()}>
            Nova Categoria
          </SlButton>
        </div>

        <div className="mb-4">
          <SlInput
            value={search}
            onSlInput={(e: any) => setSearch(e.target.value)}
            placeholder="Buscar categorias..."
            className="w-full"
          />
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Imagem</th>
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Descrição</th>
                <th className="px-4 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                    Carregando...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                    Nenhuma categoria encontrada
                  </td>
                </tr>
              ) : (
                categories.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="px-4 py-3">
                      {c.imageUrl && (
                        <div className="relative w-12 h-12">
                          <Image
                            src={c.imageUrl}
                            alt={c.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">{c.name}</td>
                    <td className="px-4 py-3">{c.description || '-'}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <SlButton size="small" onClick={() => openModal(c)}>
                        Editar
                      </SlButton>
                      <SlButton
                        size="small"
                        variant="danger"
                        onClick={() => handleDelete(c)}
                      >
                        Excluir
                      </SlButton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <SlButton
              size="small"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              Anterior
            </SlButton>
            <span className="flex items-center px-4">
              Página {currentPage} de {totalPages}
            </span>
            <SlButton
              size="small"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              Próxima
            </SlButton>
          </div>
        )}
      </div>

      <SlDialog
        label={editingCategory ? "Editar Categoria" : "Nova Categoria"}
        open={open}
        onSlAfterHide={() => setOpen(false)}
      >
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <SlInput
              value={name}
              onSlInput={(e: any) => setName(e.target.value)}
              placeholder="Nome da categoria"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <SlInput
              value={description}
              onSlInput={(e: any) => setDescription(e.target.value)}
              placeholder="Descrição da categoria (opcional)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Imagem</label>
            <ImageUpload
              value={imageUrl}
              onChange={setImageUrl}
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <SlButton onClick={() => setOpen(false)}>Cancelar</SlButton>
            <SlButton variant="primary" onClick={handleSave}>
              Salvar
            </SlButton>
          </div>
        </div>
      </SlDialog>
    </main>
  );
} 
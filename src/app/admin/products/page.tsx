'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Select from 'react-select';
import { formatCurrency } from '@/lib/formatCurrency';
import { useDropzone } from 'react-dropzone';
import { useUploadThing } from '@/lib/uploadthing';
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

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
  category?: {
    id: string;
    name: string;
  };
  extras: Extra[];
};

type Extra = {
  id: number;
  name: string;
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [imageUrl, setImageUrl] = useState('');

  const [extras, setExtras] = useState<Extra[]>([]);
  const [selectedExtraIds, setSelectedExtraIds] = useState<number[]>([]);

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [uploading, setUploading] = useState(false);
  const { startUpload } = useUploadThing("imageUploader");

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1,
    maxSize: 4 * 1024 * 1024, // 4MB
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) {
        alert('Nenhum arquivo selecionado ou arquivo inválido');
        return;
      }

      console.log('Iniciando upload de:', acceptedFiles[0].name);
      console.log('Tamanho do arquivo:', acceptedFiles[0].size);
      console.log('Tipo do arquivo:', acceptedFiles[0].type);
      setUploading(true);

      try {
        console.log('Chamando startUpload...');
        const res = await startUpload(acceptedFiles);
        console.log('Resposta completa do upload:', JSON.stringify(res, null, 2));

        if (res && res.length > 0 && res[0]) {
          const uploadedFile = res[0];
          console.log('Arquivo carregado:', uploadedFile);

          if (uploadedFile.url) {
            setImageUrl(uploadedFile.url);
            console.log('URL da imagem definida:', uploadedFile.url);
            alert('Imagem carregada com sucesso!');
          } else {
            console.error('URL não encontrada na resposta:', uploadedFile);
            throw new Error('URL da imagem não foi retornada pelo servidor');
          }
        } else {
          console.error('Resposta inválida do upload:', res);
          throw new Error('Resposta inválida do servidor de upload');
        }
      } catch (error) {
        console.error('Erro detalhado no upload:', error);
        alert(`Erro ao fazer upload da imagem: ${error.message || 'Erro desconhecido'}`);
      } finally {
        setUploading(false);
      }
    },
    onDropRejected: (fileRejections) => {
      console.log('Arquivos rejeitados:', fileRejections);
      const errors = fileRejections[0]?.errors || [];
      const errorMessages = errors.map(e => e.message).join(', ');
      alert(`Arquivo rejeitado: ${errorMessages}`);
    }
  });

  const fetchProducts = async () => {
    const res = await fetch(`/api/products?page=${page}&limit=10&sort=${sort}&search=${search}`);
    const data = await res.json();
    console.log(data)
    setProducts(data.products);
    setTotalPages(data.total === 0 ? 1 : data.total);
  };

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    console.log(data)
    setCategories(data.categories);
  };

  const fetchExtras = async () => {
    const res = await fetch('/api/extras');
    const data = await res.json();
    setExtras(data.extras);
  };

  useEffect(() => {
    fetchCategories();
    fetchExtras();
    fetchProducts();
  }, [page, sort, search]);

  const extraOptions = extras.map(extra => ({
    value: extra.id,
    label: extra.name,
  }));

  const categoryOptions = categories.map(category => ({
    value: category.id,
    label: category.name,
  }));

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setName(product.name);
      setPrice(product.price.toString());
      setDescription(product.description || '');
      setSelectedCategoryId(product.category?.id || '');
      setImageUrl(product.imageUrl || '');
      setSelectedExtraIds(product.extras?.map((e) => e.id) || []);
    } else {
      setEditingProduct(null);
      setName('');
      setPrice('');
      setDescription('');
      setSelectedCategoryId('');
      setImageUrl('');
      setSelectedExtraIds([]);
    }
    setOpen(true);
  };

  const handleSave = async () => {
    if (!name || !price) return alert('Preencha nome e preço');
    const body = { 
      name, 
      price: Number(price), 
      description, 
      categoryId: selectedCategoryId, 
      imageUrl, 
      extraIds: selectedExtraIds 
    };

    if (editingProduct) {
      await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } else {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    }

    setOpen(false);
    fetchProducts();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4" style={{color: 'var(--text-expresso)'}}>
      <div className="w-full max-w-3xl">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <h1 className="text-2xl font-bold">Gerenciar Produtos</h1>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="w-full sm:w-64">
                <SlInput
                  placeholder="Buscar produto..."
                  value={search}
                  onSlInput={(e: any) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <select
                className="p-2 border rounded bg-white"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="name">Nome (A-Z)</option>
                <option value="price">Preço (menor primeiro)</option>
              </select>
              <SlButton variant="primary" onClick={() => openModal()}>
                Novo Produto
              </SlButton>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Preço (R$)</th>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3">{formatCurrency(p.price)}</td>
                  <td className="px-4 py-3">{p.category?.name || '-'}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <SlButton size="small" onClick={() => openModal(p)}>
                      Editar
                    </SlButton>
                    <SlButton
                      size="small"
                      variant="danger"
                      onClick={() => handleDelete(p.id)}
                    >
                      Excluir
                    </SlButton>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                    Nenhum produto cadastrado
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
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Próxima
        </button>
      </div>

      <SlDialog
        label={editingProduct ? "Editar Produto" : "Novo Produto"}
        open={open}
        onSlAfterHide={() => setOpen(false)}
      >
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <SlInput
              value={name}
              onSlInput={(e: any) => setName(e.target.value)}
              placeholder="Nome do produto"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Preço</label>
            <SlInput
              type="number"
              value={price}
              onSlInput={(e: any) => setPrice(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Categoria</label>
            <Select
              options={categoryOptions}
              value={categoryOptions.find(option => option.value === selectedCategoryId)}
              onChange={(option) => setSelectedCategoryId(option?.value || '')}
              placeholder="Selecione uma categoria"
              isClearable
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <SlInput
              value={description}
              onSlInput={(e: any) => setDescription(e.target.value)}
              placeholder="Descrição do produto"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Extras</label>
            <Select
              isMulti
              options={extraOptions}
              value={extraOptions.filter(option => selectedExtraIds.includes(option.value))}
              onChange={(selected) => setSelectedExtraIds(selected.map(option => option.value))}
              placeholder="Selecione os extras"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Imagem</label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
                ${uploading ? 'border-gray-400 bg-gray-50' : 'border-gray-300 hover:border-gray-400'}
                ${imageUrl ? 'border-green-500' : ''}`}
            >
              <input {...getInputProps()} />
              {imageUrl ? (
                <div className="relative w-32 h-32 mx-auto">
                  <Image
                    src={imageUrl}
                    alt="Preview"
                    fill
                    className="object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageUrl('');
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    {uploading ? 'Enviando imagem...' : 'Arraste uma imagem ou clique para selecionar'}
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF ou WEBP até 4MB
                  </p>
                  {uploading && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full animate-pulse w-1/2"></div>
                    </div>
                  )}
                  <div className="flex justify-center">
                    <SlButton
                      type="button"
                      size="small"
                      variant="neutral"
                      disabled={uploading}
                      onClick={(e) => {
                        e.stopPropagation();
                        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
                        if (input) input.click();
                      }}
                    >
                      {uploading ? 'Enviando...' : 'Selecionar Imagem'}
                    </SlButton>
                  </div>
                </div>
              )}
            </div>
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
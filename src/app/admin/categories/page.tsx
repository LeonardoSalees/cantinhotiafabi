
'use client';

import { useState, useEffect } from 'react';
import { Category } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useDropzone } from 'react-dropzone';
import { useUploadThing } from '@/lib/uploadthing';
import { MdAdd, MdEdit, MdDelete, MdImage } from 'react-icons/md';

const SlButton = dynamic(() =>
  import('@shoelace-style/shoelace/dist/react').then((mod) => mod.SlButton),
  { ssr: false }
);

const SlInput = dynamic(() =>
  import('@shoelace-style/shoelace/dist/react').then((mod) => mod.SlInput),
  { ssr: false }
);

interface CategoryFormData {
  name: string;
  description: string;
  imageUrl: string;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    imageUrl: '',
  });
  const [uploading, setUploading] = useState(false);
  const { startUpload } = useUploadThing("imageUploader");

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;
      
      setUploading(true);
      try {
        const res = await startUpload(acceptedFiles);
        if (res?.[0]) {
          setFormData(prev => ({ ...prev, imageUrl: res[0].url }));
          toast.success('Imagem enviada com sucesso!');
        }
      } catch (error) {
        console.error('Erro no upload:', error);
        toast.error('Erro ao fazer upload da imagem');
      } finally {
        setUploading(false);
      }
    }
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      toast.error('Erro ao carregar categorias');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && editingCategory) {
        const response = await fetch(`/api/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Erro ao atualizar categoria');
        }

        toast.success('Categoria atualizada com sucesso!');
      } else {
        const response = await fetch('/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Erro ao criar categoria');
        }

        toast.success('Categoria criada com sucesso!');
      }

      setIsModalOpen(false);
      setFormData({ name: '', description: '', imageUrl: '' });
      setIsEditing(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      toast.error('Erro ao salvar categoria');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      imageUrl: category.imageUrl || '',
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (category: Category) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Erro ao excluir categoria');
      }
      
      toast.success('Categoria excluída com sucesso!');
      fetchCategories();
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      toast.error('Erro ao excluir categoria');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Categorias</h1>
              <p className="text-gray-600">Gerencie as categorias dos seus produtos</p>
            </div>
            <SlButton
              variant="primary"
              onClick={() => {
                setIsEditing(false);
                setEditingCategory(null);
                setFormData({ name: '', description: '', imageUrl: '' });
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <MdAdd className="text-lg" />
              Nova Categoria
            </SlButton>
          </div>
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <MdImage className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhuma categoria encontrada</h3>
            <p className="text-gray-500 mb-6">Comece criando sua primeira categoria de produtos</p>
            <SlButton
              variant="primary"
              onClick={() => {
                setIsEditing(false);
                setEditingCategory(null);
                setFormData({ name: '', description: '', imageUrl: '' });
                setIsModalOpen(true);
              }}
            >
              Criar Primeira Categoria
            </SlButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-48 w-full bg-gray-100">
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <MdImage className="text-4xl text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                    {category.description || 'Sem descrição'}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <SlButton
                      variant="neutral"
                      size="small"
                      onClick={() => handleEdit(category)}
                      className="flex-1 flex items-center justify-center gap-1"
                    >
                      <MdEdit className="text-sm" />
                      Editar
                    </SlButton>
                    <SlButton
                      variant="danger"
                      size="small"
                      onClick={() => handleDelete(category)}
                      className="flex-1 flex items-center justify-center gap-1"
                    >
                      <MdDelete className="text-sm" />
                      Excluir
                    </SlButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nome */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome *
                    </label>
                    <SlInput
                      type="text"
                      value={formData.name}
                      onSlInput={(e: any) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Ex: Bebidas, Lanches, Sobremesas..."
                      required
                    />
                  </div>

                  {/* Descrição */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                      rows={3}
                      placeholder="Descrição da categoria..."
                    />
                  </div>

                  {/* Upload de Imagem */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Imagem da Categoria
                    </label>
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                        ${uploading ? 'border-gray-400 bg-gray-50' : 'border-gray-300 hover:border-amber-400 hover:bg-amber-50'}
                        ${formData.imageUrl ? 'border-green-500 bg-green-50' : ''}`}
                    >
                      <input {...getInputProps()} />
                      {formData.imageUrl ? (
                        <div className="space-y-3">
                          <div className="relative w-32 h-32 mx-auto">
                            <Image
                              src={formData.imageUrl}
                              alt="Preview"
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <p className="text-sm text-green-600 font-medium">
                            Imagem carregada com sucesso!
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <MdImage className="text-4xl text-gray-400 mx-auto" />
                          <div>
                            <p className="text-sm text-gray-600">
                              {uploading ? 'Enviando imagem...' : 'Arraste uma imagem ou clique para selecionar'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              PNG, JPG ou GIF até 5MB
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Botões */}
                  <div className="flex gap-3 pt-4">
                    <SlButton
                      variant="neutral"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </SlButton>
                    <SlButton
                      type="submit"
                      variant="primary"
                      className="flex-1"
                      disabled={uploading}
                    >
                      {isEditing ? 'Atualizar' : 'Criar'}
                    </SlButton>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

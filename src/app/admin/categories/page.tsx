'use client';

import { useState, useEffect } from 'react';
import { Category } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useDropzone } from 'react-dropzone';
import { useUploadThing } from '@/lib/uploadthing';

const SlButton = dynamic(() =>
  import('@shoelace-style/shoelace/dist/react').then((mod) => mod.SlButton),
  { ssr: false }
);

const SlInput = dynamic(() =>
  import('@shoelace-style/shoelace/dist/react').then((mod) => mod.SlInput),
  { ssr: false }
);

const SlDialog = dynamic(() =>
  import('@shoelace-style/shoelace/dist/react').then((mod) => mod.SlDialog),
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
    <div className="max-w-7xl mx-auto px-4 py-8" style={{ color: 'var(--text-expresso)' }}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gerenciar Categorias</h1>
        <SlButton
          variant="primary"
          onClick={() => {
            setIsEditing(false);
            setEditingCategory(null);
            setFormData({ name: '', description: '', imageUrl: '' });
            setIsModalOpen(true);
          }}
        >
          Nova Categoria
        </SlButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative h-48 w-full">
              {category.imageUrl ? (
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-4xl">+</span>
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{category.description}</p>
              <div className="flex justify-end gap-2">
                <SlButton
                  variant="neutral"
                  size="small"
                  onClick={() => handleEdit(category)}
                >
                  Editar
                </SlButton>
                <SlButton
                  variant="danger"
                  size="small"
                  onClick={() => handleDelete(category)}
                >
                  Excluir
                </SlButton>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
              </h2>
              <SlButton
                variant="neutral"
                size="small"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </SlButton>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <SlInput
                  type="text"
                  value={formData.name}
                  onSlInput={(e: any) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imagem
                </label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
                    ${uploading ? 'border-gray-400 bg-gray-50' : 'border-gray-300 hover:border-gray-400'}
                    ${formData.imageUrl ? 'border-green-500' : ''}`}
                >
                  <input {...getInputProps()} />
                  {formData.imageUrl ? (
                    <div className="relative w-32 h-32 mx-auto">
                      <Image
                        src={formData.imageUrl}
                        alt="Preview"
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        {uploading ? 'Enviando...' : 'Arraste uma imagem ou clique para selecionar'}
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG ou GIF até 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <SlButton
                  variant="neutral"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </SlButton>
                <SlButton
                  type="submit"
                  variant="primary"
                >
                  {isEditing ? 'Atualizar' : 'Criar'}
                </SlButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 
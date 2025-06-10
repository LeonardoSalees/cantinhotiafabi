'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUploadThing } from '@/app/lib/uploadthing';
import Image from 'next/image';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { startUpload } = useUploadThing('imageUploader');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setIsUploading(true);
      const uploadedFiles = await startUpload(acceptedFiles);
      if (uploadedFiles?.[0]) {
        onChange(uploadedFiles[0].url);
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload da imagem');
    } finally {
      setIsUploading(false);
    }
  }, [startUpload, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    disabled: isUploading
  });

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        {value ? (
          <div className="relative w-full aspect-video">
            <Image
              src={value}
              alt="Imagem da categoria"
              fill
              className="object-contain rounded-lg"
            />
          </div>
        ) : (
          <div className="py-8">
            {isUploading ? (
              <p className="text-gray-500">Enviando imagem...</p>
            ) : (
              <>
                <p className="text-gray-600">
                  {isDragActive
                    ? 'Solte a imagem aqui...'
                    : 'Arraste uma imagem ou clique para selecionar'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  PNG, JPG, GIF até 5MB
                </p>
              </>
            )}
          </div>
        )}
      </div>
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="text-sm text-red-500 hover:text-red-600"
        >
          Remover imagem
        </button>
      )}
    </div>
  );
} 
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });

  if (!product) {
    return {
      title: "Produto não encontrado",
    };
  }

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      extras: true,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {product.imageUrl && (
          <div className="relative aspect-square">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-2xl font-bold text-primary mb-6">
            R$ {product.price.toFixed(2)}
          </p>
          {product.category && (
            <p className="text-sm text-gray-500 mb-4">
              Categoria: {product.category.name}
            </p>
          )}
          {product.extras && product.extras.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Extras disponíveis</h2>
              <div className="space-y-2">
                {product.extras.map((extra) => (
                  <div
                    key={extra.id}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded"
                  >
                    <span>{extra.name}</span>
                    <span className="font-semibold">
                      +R$ {extra.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
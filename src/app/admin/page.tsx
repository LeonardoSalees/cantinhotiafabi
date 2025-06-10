// app/admin/dashboard/page.tsx
"use client";

import Link from "next/link";

export default function Dashboard() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Painel do Administrador</h1>

        <ul className="space-y-4">
          <li>
            <Link
              href="/admin/categories"
              className="block text-center w-full py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Gerenciar Categorias
            </Link>
          </li>
          <li>
            <Link
              href="/admin/products"
              className="block text-center w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Gerenciar Produtos
            </Link>
          </li>
          <li>
            <Link
              href="/admin/extras"
              className="block text-center w-full py-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              Gerenciar Extras
            </Link>
          </li>
          <li>
            <Link
              href="/admin/orders"
              className="block text-center w-full py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Pedidos Confirmados
            </Link>
          </li>
          <li>
            <Link
              href="/admin/settings"
              className="block text-center w-full py-3 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              Configurações
            </Link>
          </li>
        </ul>
      </div>
    </main>
  );
}

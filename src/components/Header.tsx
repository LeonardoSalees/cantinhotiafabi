// components/Header.tsx
'use client';

import Image from 'next/image';
import Link from "next/link";
import { GiShoppingCart } from "react-icons/gi";
import { useCart } from '../context/CartContext';
import { useSession, signOut } from "next-auth/react";
import dynamic from 'next/dynamic';
import { ProductFilterBar } from './ProductFilterBar';
import { useSearch } from '@/context/SearchContext';

const SlButton = dynamic(
  () =>
    import('@shoelace-style/shoelace/dist/react').then((mod) => mod.SlButton),
  { ssr: false }
);
const SlDropdown = dynamic(
  () =>
    import('@shoelace-style/shoelace/dist/react').then((mod) => mod.SlDropdown),
  { ssr: false }
);
const SlMenu = dynamic(
  () =>
    import('@shoelace-style/shoelace/dist/react').then((mod) => mod.SlMenu),
  { ssr: false }
);
const SlMenuItem = dynamic(
  () =>
    import('@shoelace-style/shoelace/dist/react').then((mod) => mod.SlMenuItem),
  { ssr: false }
);

export default function Header() {
  const {items} = useCart()
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const { search, setSearch, sort, setSort, setPage } = useSearch();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto">
        {/* Barra principal */}
        <div className="flex items-center justify-between py-3 px-4 lg:px-6">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 transition-transform hover:scale-105">
            <Image 
              src="/logo.png" 
              alt="Cantinho da Tia Fabi" 
              width={80} 
              height={80} 
              priority
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
            />
          </Link>

          {/* Navegação desktop */}
          <nav className="hidden lg:flex items-center space-x-1">
            {isAdmin && (
              <>
                <Link href="/admin/orders">
                  <SlButton variant="text" size="small">Pedidos</SlButton>
                </Link>
                <Link href="/admin/categories">
                  <SlButton variant="text" size="small">Categorias</SlButton>
                </Link>
                <Link href="/admin/products">
                  <SlButton variant="text" size="small">Produtos</SlButton>
                </Link>
                <Link href="/admin/extras">
                  <SlButton variant="text" size="small">Extras</SlButton>
                </Link>
              </>
            )}
          </nav>

          {/* Ações do usuário */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Carrinho */}
            <Link href="/cart" className="relative">
              <SlButton variant="primary" size="small" className="!min-w-[44px]">
                <div className='flex items-center gap-1.5'>
                  <span className="text-sm font-medium">{items.length}</span>
                  <GiShoppingCart size={18} />
                </div>
              </SlButton>
            </Link>

            {/* Menu do usuário */}
            <SlDropdown>
              <SlButton slot="trigger" caret size="small" className="!min-w-[44px]">
                <span className="hidden sm:inline text-sm">
                  {session?.user?.name ? session.user.name.split(' ')[0] : 'Conta'}
                </span>
                <span className="sm:hidden">👤</span>
              </SlButton>
              <SlMenu>
                {session ? (
                  <>
                    {isAdmin && (
                      <Link href="/admin">
                        <SlMenuItem>📊 Painel Admin</SlMenuItem>
                      </Link>
                    )}
                    <SlMenuItem onClick={() => signOut()}>🚪 Sair</SlMenuItem>
                  </>
                ) : (
                  <Link href="/login">
                    <SlMenuItem>🔑 Entrar</SlMenuItem>
                  </Link>
                )}
              </SlMenu>
            </SlDropdown>
          </div>
        </div>

        {/* Barra de pesquisa */}
        <div className="px-4 lg:px-6 pb-3">
          <ProductFilterBar
            search={search}
            setSearch={setSearch}
            sort={sort}
            setSort={setSort}
            setPage={setPage}
          />
        </div>
      </div>
    </header>
  );
}

// components/Header.tsx
'use client';

import Image from 'next/image';
import Link from "next/link";
import { GiShoppingCart } from "react-icons/gi";
import { useCart } from '../context/CartContext';
import { useSession, signOut } from "next-auth/react";
import dynamic from 'next/dynamic';

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

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo / Nome da loja */}
        <Link href="/" className="text-xl font-bold text-green-600">
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
        </Link>

        {/* Navegação principal */}
        <div className="hidden sm:flex items-center gap-4">
          {isAdmin && (
            <>
              <Link href="/admin/products">
                <SlButton variant="text">Gerenciar Pedidos</SlButton>
              </Link>
              <Link href="/admin/products">
                <SlButton variant="text">Gerenciar Categorias</SlButton>
              </Link>
              <Link href="/admin/products">
                <SlButton variant="text">Gerenciar Produtos</SlButton>
              </Link>
              <Link href="/admin/extras">
                <SlButton variant="text">Gerenciar Extras</SlButton>
              </Link>
            </>
          )}
        </div>

        {/* Menu / Carrinho / Dropdown */}
        <div className="flex items-center gap-4">
          <Link href="/cart">
            <SlButton variant="primary">
              <div className='flex items-center gap-1'>
              <p>{items.length}</p>
              <GiShoppingCart color='white' size={20} />
              </div>
            </SlButton>
          </Link>

          {/* Dropdown de conta */}
          <SlDropdown>
            <SlButton slot="trigger" caret>
              {session ? session.user.name : 'Conta'}
            </SlButton>
            <SlMenu>
              {session ? (
                <>
                  {isAdmin && (
                    <Link href="/admin">
                      <SlMenuItem>Painel Admin</SlMenuItem>
                    </Link>
                  )}
                  <SlMenuItem onClick={() => signOut()}>Sair</SlMenuItem>
                </>
              ) : (
                <Link href="/login">
                  <SlMenuItem>Entrar</SlMenuItem>
                </Link>
              )}
            </SlMenu>
          </SlDropdown>
        </div>
      </div>
    </header>
  );
}

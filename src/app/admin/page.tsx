
"use client";

import Link from "next/link";
import { 
  MdCategory, 
  MdInventory, 
  MdExtension, 
  MdReceipt, 
  MdSettings,
  MdDashboard 
} from "react-icons/md";

export default function Dashboard() {
  const adminSections = [
    {
      title: "Categorias",
      description: "Gerenciar categorias de produtos",
      href: "/admin/categories",
      icon: MdCategory,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700"
    },
    {
      title: "Produtos",
      description: "Gerenciar produtos do cardápio",
      href: "/admin/products",
      icon: MdInventory,
      color: "bg-gradient-to-br from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700"
    },
    {
      title: "Extras",
      description: "Gerenciar complementos e adicionais",
      href: "/admin/extras",
      icon: MdExtension,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      hoverColor: "hover:from-purple-600 hover:to-purple-700"
    },
    {
      title: "Pedidos",
      description: "Visualizar e gerenciar pedidos",
      href: "/admin/orders",
      icon: MdReceipt,
      color: "bg-gradient-to-br from-amber-500 to-amber-600",
      hoverColor: "hover:from-amber-600 hover:to-amber-700"
    },
    {
      title: "Configurações",
      description: "Configurações do sistema",
      href: "/admin/settings",
      icon: MdSettings,
      color: "bg-gradient-to-br from-gray-500 to-gray-600",
      hoverColor: "hover:from-gray-600 hover:to-gray-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <MdDashboard className="text-4xl text-amber-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">
              Painel Administrativo
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Gerencie todos os aspectos do seu negócio de forma simples e eficiente
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {adminSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <Link
                key={section.href}
                href={section.href}
                className="group block"
              >
                <div className={`
                  ${section.color} ${section.hoverColor}
                  rounded-xl p-6 text-white shadow-lg
                  transform transition-all duration-300
                  hover:scale-105 hover:shadow-xl
                  border border-white/20
                `}>
                  <div className="flex items-center mb-4">
                    <IconComponent className="text-3xl mr-3 opacity-90" />
                    <h3 className="text-xl font-semibold">
                      {section.title}
                    </h3>
                  </div>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {section.description}
                  </p>
                  <div className="mt-4 flex items-center text-sm font-medium">
                    <span>Acessar</span>
                    <svg 
                      className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-16 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Acesso Rápido
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">📊</div>
              <div className="text-sm text-gray-600 mt-1">Dashboard</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">📋</div>
              <div className="text-sm text-gray-600 mt-1">Relatórios</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">👥</div>
              <div className="text-sm text-gray-600 mt-1">Clientes</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">💰</div>
              <div className="text-sm text-gray-600 mt-1">Financeiro</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

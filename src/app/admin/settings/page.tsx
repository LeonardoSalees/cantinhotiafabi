
'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MdSettings, MdDeliveryDining, MdCheck, MdClose } from 'react-icons/md';

const SlSwitch = dynamic(() =>
  import('@shoelace-style/shoelace/dist/react').then((mod) => mod.SlSwitch),
  { ssr: false }
);

export default function AdminSettingsPage() {
  const [deliveryEnabled, setDeliveryEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setDeliveryEnabled(data.deliveryEnabled);
        setLoading(false);
      });
  }, []);

  const handleToggle = async () => {
    const newValue = !deliveryEnabled;
    setDeliveryEnabled(newValue);

    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deliveryEnabled: newValue }),
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando configurações...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-3">
            <MdSettings className="text-3xl text-amber-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Configurações</h1>
              <p className="text-gray-600">Gerencie as configurações do sistema</p>
            </div>
          </div>
        </div>

        {/* Settings Cards */}
        <div className="space-y-6">
          {/* Delivery Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <MdDeliveryDining className="text-2xl text-blue-600" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Entrega</h2>
                  <p className="text-sm text-gray-600">Configure as opções de entrega</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Sistema de Entrega
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 sm:mb-0">
                    {deliveryEnabled 
                      ? 'O sistema de entrega está ativo. Os clientes podem solicitar entrega em domicílio.'
                      : 'O sistema de entrega está desativado. Apenas retirada no local está disponível.'
                    }
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    deliveryEnabled 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {deliveryEnabled ? <MdCheck /> : <MdClose />}
                    {deliveryEnabled ? 'Ativo' : 'Inativo'}
                  </div>

                  <SlSwitch
                    checked={deliveryEnabled}
                    onSlChange={handleToggle}
                    size="large"
                  />
                </div>
              </div>

              {/* Status Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${deliveryEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm text-gray-600">
                      Status: <span className="font-medium">{deliveryEnabled ? 'Entrega Ativa' : 'Apenas Retirada'}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-gray-600">
                      Último update: <span className="font-medium">Agora</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Future Settings Placeholder */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Outras Configurações</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-500 text-center py-8">
                Mais configurações serão adicionadas em breve...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

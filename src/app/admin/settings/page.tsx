'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

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

  if (loading) return <p className="max-w-xl mx-auto p-6" style={{color: 'var(--text-expresso)'}}>Carregando configurações...</p>;

  return (
    <div className="max-w-xl mx-auto p-6" style={{color: 'var(--text-expresso)'}}>
      <h1 className="text-2xl font-bold mb-4">Configurações</h1>

      <div className="flex items-center justify-between bg-white p-4 rounded shadow">
        <span className="text-lg">Ativar entrega</span>
        <SlSwitch
          checked={deliveryEnabled}
          onSlChange={handleToggle}
        />
      </div>
    </div>
  );
}

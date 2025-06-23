
'use client';

import { useCart } from '@/context/CartContext';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Settings } from '@/types/settings';
import PhoneInput from '../../components/PhoneInput';
import { CreateOrderInput, DeliveryType, OrderItemInput, OrderStatus } from '@/types/order';
import PixPayment from '../../components/PixPayment';
import { useRouter } from 'next/navigation';

const SlButton = dynamic(() =>
  import('@shoelace-style/shoelace/dist/react').then((mod) => mod.SlButton),
  { ssr: false }
);
const SlRadioGroup = dynamic(() =>
  import('@shoelace-style/shoelace/dist/react').then((mod) => mod.SlRadioGroup),
  { ssr: false }
);
const SlRadio = dynamic(() =>
  import('@shoelace-style/shoelace/dist/react').then((mod) => mod.SlRadio),
  { ssr: false }
);
const SlInput = dynamic(() =>
  import('@shoelace-style/shoelace/dist/react').then((mod) => mod.SlInput),
  { ssr: false }
);

export default function CheckoutPage() {
  const { cartItems, clearCart, getTotal } = useCart();
  const [deliveryEnabled, setDeliveryEnabled] = useState(false);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>(DeliveryType.RETIRAR);
  const [address, setAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPixPayment, setShowPixPayment] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const router = useRouter();

  const total = getTotal();

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data: Settings) => setDeliveryEnabled(data.deliveryEnabled));
  }, []);

  const handleCheckout = async () => {
    if (deliveryType === DeliveryType.ENTREGAR && !address.trim()) {
      alert('Por favor, informe o endereço para entrega.');
      return;
    }
    if (!customerName.trim()) {
      alert('Por favor, informe o seu nome.');
      return;
    }
    if (!phone.trim()) {
      alert('Por favor, informe o número do seu celular.');
      return;
    }

    setLoading(true);
    const order: CreateOrderInput = {
      id: '',
      customerName,
      customerPhone: phone,
      customerAddress: deliveryType === DeliveryType.ENTREGAR ? address : undefined,
      status: OrderStatus.PENDENTE,
      items: cartItems,
      total,
      deliveryType: deliveryType === undefined ? DeliveryType.RETIRAR : DeliveryType.ENTREGAR,
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({order}),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar pedido');
      }

      const data = await response.json();
      setOrderId(data.id);
      setShowPixPayment(true);
    } catch (error) {
      alert('Erro ao processar pedido. Tente novamente.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (showPixPayment && orderId) {
    return (
      <div className="max-w-3xl mx-auto p-6" style={{color: 'var(--text-expresso'}}>
        <h1 className="text-2xl font-bold mb-6">Pagamento PIX</h1>
        <PixPayment
          orderId={orderId}
          amount={total}
          description={`Pedido #${orderId} - Cantinho da Tia Fabi`}
          onSuccess={() => {
            clearCart();
            router.push('/order-success');
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6" style={{ color: 'var(--text-expresso)' }}>
      <h1 className="text-2xl font-bold mb-6">Resumo do Pedido</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Seu carrinho está vazio.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 shadow-sm bg-white">
                <div className="flex justify-between items-center mb-1">
                  <h2 className="text-lg font-semibold">{item.product.name}</h2>
                  <span className="text-sm text-gray-500">x{item.quantity}</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Preço: R$ {item.product.price.toFixed(2)}
                </p>
                {item.extras.length > 0 && (
                  <ul className="text-sm mt-2 text-gray-700">
                    {item.extras.map((extra, i) => (
                      <li key={i}>+ {extra.name} (R$ {extra.price.toFixed(2)})</li>
                    ))}
                  </ul>
                )}
                <p className="mt-2 font-semibold text-right text-green-700">
                  Total: R$ {((item.product.price * item.quantity) + (item.extras.reduce((sum, extra) => sum + extra.price, 0))).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          {deliveryEnabled === false && (
            <div className="mt-6">
              <h2 className="font-semibold mb-2">Forma de Entrega</h2>
              <p className="text-gray-600">Entrega não disponível no momento.</p>
              <p className="text-gray-600">Retire seu pedido na loja (Rua Uapuca, 143 - Itaquera - São Paulo/SP).</p>
            </div>
          )}
          {deliveryEnabled && (
            <div className="mt-6">
              <h2 className="font-semibold mb-2">Forma de Entrega</h2>
              <SlRadioGroup
                value={deliveryType}
                onSlChange={(e: any) => setDeliveryType(e.target.value as DeliveryType)}
              >
                <SlRadio value={DeliveryType.RETIRAR}>Retirada</SlRadio>
                <SlRadio value={DeliveryType.ENTREGAR}>Entrega</SlRadio>
              </SlRadioGroup>
            </div>
          )}

          {deliveryEnabled && deliveryType ===  DeliveryType.ENTREGAR && (
            <div className="mt-4">
              <SlInput
                label="Endereço para entrega"
                value={address}
                onSlInput={(e: any) => setAddress(e.target.value)}
                required
              />
            </div>
          )}
          <div className="mt-4">
            <SlInput
              label="Nome"
              value={customerName}
              onSlInput={(e: any) => setCustomerName(e.target.value)}
              required
            />
          </div>
          <div className="mt-4">
            <PhoneInput value={phone} onChange={setPhone} />
          </div>
          <div className="mt-6 border-t pt-4 flex justify-between items-center">
            <span className="text-xl font-bold">Total Geral:</span>
            <span className="text-xl font-bold text-green-700">R$ {total.toFixed(2)}</span>
          </div>

          <div className="mt-6 flex justify-end">
            <SlButton variant="primary" loading={loading} onClick={handleCheckout}>
              Finalizar Compra
            </SlButton>
          </div>
        </>
      )}
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { CreateOrderInput } from '@/types/order';

const SlButton = dynamic(() =>
    import('@shoelace-style/shoelace/dist/react').then((mod) => mod.SlButton), { ssr: false }
);

export default function AdminPedidosPage() {
    const [orders, setOrders] = useState<CreateOrderInput[]>([]);
    const [refetch, setRefetch] = useState(false);


    useEffect(() => {
        async function fetchOrders() {
            const res = await fetch('/api/orders');
            const data = await res.json();
            setOrders(data);
            console.log(data)
        }

        fetchOrders();
    }, []);

    async function markAsStatus(orderId: number, status: string) {
        const res = await fetch(`/api/orders/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });

        if (res.ok) {
            const updatedOrder = await res.json();
            setOrders(prev =>
                prev.map(o => o.id === updatedOrder.id ? updatedOrder : o)
            );
            setRefetch(true)
        } else {
            alert('Erro ao atualizar status do pedido');
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6" style={{ color: 'var(--text-expresso)' }}>
            <h1 className="text-2xl font-bold mb-4">📋 Pedidos Recebidos</h1>

            {orders.length === 0 ? (
                <p className="text-gray-500">Nenhum pedido até o momento.</p>
            ) : (
                <div className="space-y-4">
                    {orders && orders.map(order => (
                        <div key={order.id} className="border p-4 rounded-lg shadow-sm bg-white">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-lg font-semibold">Pedido #{order.id}</h2>
                                {order.utcCreatedOn &&  <span className="text-sm text-gray-500">{new Date(order.utcCreatedOn).toLocaleString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}</span>}
                            </div>
                            <p>{order.deliveryType && order.deliveryType} </p>
                            {order.customerAddress && <p><strong>Endereço:</strong> {order.customerAddress}</p>}
                            <p><strong>Cliente:</strong> {order.customerName}</p>
                            <p><strong>Telefone:</strong> {order.customerPhone}</p>
                            <p><strong>Status:</strong> {order.status && order.status}</p>
                            <p><strong>Status do pagamento:</strong> {order.paymentStatus && order.paymentStatus}</p>

                            <ul className="mt-2 text-sm list-disc ml-5">
                                {order.items?.map(item => (
                                    <div key={item.id}>
                                        <li>{item.quantity}x {item.product.name}</li>
                                        {item.extras?.map((extra) => (
                                            <p key={extra.id}>-- {extra.name} R${extra.price}</p>
                                        ))}
                                    </div>
                                ))}
                            </ul>

                            <div className="mt-3 flex justify-between items-center">
                                <strong className="text-green-600">Total: R$ {order.total.toFixed(2)}</strong>
                                <select
                                    className="border rounded px-2 py-1 text-sm"
                                    value={order.status}
                                    onChange={(e) => markAsStatus(Number(order.id), e.target.value)}
                                >
                                    <option value="PENDENTE">PENDENTE</option>
                                    <option value="CONFIRMADO">CONFIRMADO</option>
                                    <option value="PREPARANDO">PREPARANDO</option>
                                    <option value="PRONTO">PRONTO</option>
                                    <option value="EM_ENTREGA">EM_ENTREGA</option>
                                    <option value="ENTREGUE">ENTREGUE</option>
                                    <option value="RETIRADO">RETIRADO</option>
                                    <option value="CANCELADO">CANCELADO</option>
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

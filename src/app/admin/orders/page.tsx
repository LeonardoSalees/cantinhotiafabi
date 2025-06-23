
'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { CreateOrderInput } from '@/types/order';
import { MdReceipt, MdLocationOn, MdPerson, MdPhone, MdAccessTime } from 'react-icons/md';

const SlButton = dynamic(() =>
    import('@shoelace-style/shoelace/dist/react').then((mod) => mod.SlButton), { ssr: false }
);

export default function AdminPedidosPage() {
    const [orders, setOrders] = useState<CreateOrderInput[]>([]);

    useEffect(() => {
        async function fetchOrders() {
            const res = await fetch('/api/orders');
            const data = await res.json();
            setOrders(data);
        }

        fetchOrders();
    }, []);

    async function markAsStatus(orderId: string, status: string) {
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
        } else {
            alert('Erro ao atualizar status do pedido');
        }
    }

    const getStatusColor = (status: string) => {
        const colors = {
            'PENDENTE': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'CONFIRMADO': 'bg-blue-100 text-blue-800 border-blue-200',
            'PREPARANDO': 'bg-orange-100 text-orange-800 border-orange-200',
            'PRONTO': 'bg-purple-100 text-purple-800 border-purple-200',
            'EM_ENTREGA': 'bg-indigo-100 text-indigo-800 border-indigo-200',
            'ENTREGUE': 'bg-green-100 text-green-800 border-green-200',
            'RETIRADO': 'bg-green-100 text-green-800 border-green-200',
            'CANCELADO': 'bg-red-100 text-red-800 border-red-200'
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getPaymentStatusColor = (status: string) => {
        const colors = {
            'PENDING': 'bg-yellow-100 text-yellow-800',
            'APPROVED': 'bg-green-100 text-green-800',
            'REJECTED': 'bg-red-100 text-red-800',
            'CANCELLED': 'bg-gray-100 text-gray-800'
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex items-center gap-3">
                        <MdReceipt className="text-3xl text-amber-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Pedidos</h1>
                            <p className="text-gray-600">Gerencie todos os pedidos recebidos</p>
                        </div>
                    </div>
                </div>

                {/* Orders */}
                {orders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <MdReceipt className="text-6xl text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum pedido encontrado</h3>
                        <p className="text-gray-500">Os pedidos aparecerão aqui quando os clientes fizerem compras</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                {/* Header do pedido */}
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-xl font-bold text-gray-800">
                                                Pedido #{order.id?.toString().slice(-6)}
                                            </h2>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status || 'PENDENTE')}`}>
                                                {order.status || 'PENDENTE'}
                                            </span>
                                        </div>
                                        {order.utcCreatedOn && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <MdAccessTime />
                                                {new Date(order.utcCreatedOn).toLocaleString('pt-BR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6">
                                    {/* Informações do cliente */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div className="space-y-3">
                                            <h3 className="font-semibold text-gray-800 mb-3">Informações do Cliente</h3>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <MdPerson className="text-lg" />
                                                <span>{order.customerName}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <MdPhone className="text-lg" />
                                                <span>{order.customerPhone}</span>
                                            </div>
                                            {order.customerAddress && (
                                                <div className="flex items-start gap-2 text-gray-600">
                                                    <MdLocationOn className="text-lg mt-0.5" />
                                                    <span className="flex-1">{order.customerAddress}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <h3 className="font-semibold text-gray-800 mb-3">Detalhes do Pedido</h3>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Tipo de entrega:</span>
                                                    <span className="font-medium">{order.deliveryType}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Status do pagamento:</span>
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPaymentStatusColor(order.paymentStatus || 'PENDING')}`}>
                                                        {order.paymentStatus || 'PENDING'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center pt-2 border-t">
                                                    <span className="text-lg font-semibold text-gray-800">Total:</span>
                                                    <span className="text-2xl font-bold text-green-600">
                                                        R$ {order.total.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Itens do pedido */}
                                    <div className="mb-6">
                                        <h3 className="font-semibold text-gray-800 mb-3">Itens do Pedido</h3>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            {order.items?.map(item => (
                                                <div key={item.id} className="py-2 border-b border-gray-200 last:border-b-0">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <span className="font-medium text-gray-800">
                                                                {item.quantity}x {item.product.name}
                                                            </span>
                                                            {item.extras && item.extras.length > 0 && (
                                                                <div className="mt-1 space-y-1">
                                                                    {item.extras.map((extra) => (
                                                                        <div key={extra.id} className="text-sm text-gray-600 ml-4">
                                                                            + {extra.name} {extra.price > 0 && `(R$ ${extra.price.toFixed(2)})`}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Controle de status */}
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-200">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Atualizar Status:
                                            </label>
                                            <select
                                                className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                                                value={order.status}
                                                onChange={(e) => markAsStatus(String(order.id), e.target.value)}
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
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

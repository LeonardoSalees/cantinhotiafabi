import { Extra } from "./extra";
import { Product } from "./product";

export type OrderItemInput = {
  id?: string | number;
  productId: number;
  quantity: number;
  extraIds?: number[];
};

export type CreateOrderInput = {
  id?: string | number;
  customerName: string;
  customerPhone: string;
  customerAddress?: string | null;
  deliveryType: DeliveryType,
  status: OrderStatus;
  paymentStatus?:   PaymentStatus
  paymentId?:       string     // ID do pagamento no Mercado Pago
  total: number;
  items: CartItem[];
  utcCreatedOn?: string | Date;

};

export type CartItem = {
  id?: string | number;
  product: Product;
  quantity: number;
  extras: Extra[];
};

export enum DeliveryType {
  RETIRAR = 'RETIRAR',
  ENTREGAR = 'ENTREGAR',
}

export enum OrderStatus {
  PENDENTE = 'PENDENTE',
  CONFIRMADO = 'CONFIRMADO',
  PREPARANDO = 'PREPARANDO',
  PRONTO = 'PRONTO',
  EM_ENTREGA = 'EM_ENTREGA',
  ENTREGUE = 'ENTREGUE',
  RETIRADO = 'RETIRADO',
  CANCELADO = 'CANCELADO',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}
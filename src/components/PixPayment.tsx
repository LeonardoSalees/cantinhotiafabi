'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const SlButton = dynamic(() =>
  import('@shoelace-style/shoelace/dist/react').then((mod) => mod.SlButton),
  { ssr: false }
);

interface PixPaymentProps {
  orderId: string;
  amount: number;
  description: string;
  onSuccess: () => void;
}

export default function PixPayment({ orderId, amount, description, onSuccess }: PixPaymentProps) {
  const [qrCode, setQrCode] = useState('');
  const [qrCodeBase64, setQrCodeBase64] = useState('');
  const [ticketUrl, setTicketUrl] = useState('');
  const [showFullCode, setShowFullCode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generatePix = async () => {
    try {
      const response = await fetch('/api/payments/pix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          amount,
          description,
        }),
      });

      if (!response.ok) {
          const errorData = await response.json();
          console.log(Error(errorData.error || 'Erro ao gerar PIX'))
      }

      const data = await response.json();
      setQrCode(data.qrCode);
      setQrCodeBase64(data.qrCodeBase64);
      setTicketUrl(data.ticketUrl);
      } catch (error) {
        console.error('Erro ao gerar PIX:', error);
        setError(error instanceof Error ? error.message : 'Erro ao gerar PIX');
    } finally {
      setLoading(false);
    }
  };

    generatePix();
  }, [orderId, amount, description]);

  const copyPixCode = () => {
      navigator.clipboard.writeText(qrCode);
      alert('Código PIX copiado!');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <p>Gerando PIX...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <p className="text-red-500 mb-4">{error}</p>
        <SlButton variant="primary" onClick={() => window.location.reload()}>
          Tentar Novamente
        </SlButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h3 className="text-lg font-semibold mb-4">Pagamento via PIX</h3>
      
      {qrCodeBase64 && (
        <div className="mb-4">
          <Image
            src={`data:image/png;base64,${qrCodeBase64}`}
            alt="QR Code PIX"
            width={200}
            height={200}
            className="rounded-lg"
            priority
          />
        </div>
      )}

      <div className="w-full max-w-md">
        <p className="text-sm text-gray-600 mb-2">
          Escaneie o QR Code acima ou copie o código PIX abaixo:
        </p>
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={showFullCode ? qrCode : qrCode.substring(0, 50) + '...'}
              readOnly
              className="flex-1 p-2 border rounded text-sm"
            />
            <SlButton size="small" onClick={copyPixCode}>
              Copiar
            </SlButton>
          </div>
          <SlButton 
            size="small" 
            variant="neutral"
            onClick={() => setShowFullCode(!showFullCode)}
          >
            {showFullCode ? 'Mostrar menos' : 'Mostrar código completo'}
          </SlButton>
          {ticketUrl && (
            <a 
              href={ticketUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 text-center"
            >
              Abrir comprovante PIX
            </a>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-500 mt-4">
        <p>Após o pagamento, seu pedido será processado automaticamente.</p>
        <p>O prazo de validade do PIX é de 30 minutos.</p>
      </div>
    </div>
  );
} 
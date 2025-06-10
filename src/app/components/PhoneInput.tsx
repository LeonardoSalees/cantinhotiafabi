'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const SlInput = dynamic(() =>
  import('@shoelace-style/shoelace/dist/react').then((mod) => mod.SlInput),
  { ssr: false }
);

export default function PhoneInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  function formatPhone(input: string) {
    const cleaned = input.replace(/\D/g, '');

    if (cleaned.length === 0) return '';

    const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
    if (!match) return cleaned;

    const [, ddd, first, last] = match;
    if (cleaned.length <= 2) return `(${ddd}`;
    if (cleaned.length <= 7) return `(${ddd}) ${first}`;
    return `(${ddd}) ${first}-${last}`;
  }

  function handleChange(e: any) {
    const raw = e.target.value as string;
    const formatted = formatPhone(raw);
    onChange(formatted);
  }

  return (
    <SlInput
      type="text"
      label="Celular para contato"
      value={value}
      onSlInput={handleChange}
      required
      placeholder="(00) 91234-5678"
      maxlength={15}
    />
  );
}

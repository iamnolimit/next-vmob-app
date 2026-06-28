'use client';
import { useState } from 'react';

interface AvatarImageProps {
  src: string;
  alt: string;
  fallbackText: string;
  className?: string;
}

function toProxiedUrl(src: string): string {
  if (!src || !src.startsWith('http')) return src;
  return `/api/image-proxy?url=${encodeURIComponent(src)}`;
}

export default function AvatarImage({ src, alt, fallbackText, className = '' }: AvatarImageProps) {
  const [error, setError] = useState(false);

  if (error || !src || !src.startsWith('http')) {
    return <span className="w-full h-full flex items-center justify-center font-bold">{fallbackText}</span>;
  }

  return (
    <img
      src={toProxiedUrl(src)}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}
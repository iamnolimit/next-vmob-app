'use client';
import { useState } from 'react';

interface AvatarImageProps {
  src: string;
  alt: string;
  fallbackText: string;
  className?: string;
}

export default function AvatarImage({ src, alt, fallbackText, className = '' }: AvatarImageProps) {
  const [error, setError] = useState(false);

  if (error || !src.startsWith('http')) {
    return <span className="w-full h-full flex items-center justify-center">{fallbackText}</span>;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}
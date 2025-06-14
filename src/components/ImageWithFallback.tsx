import { useState } from 'react'

export function ImageWithFallback({ src, alt, className }: { src: string, alt: string, className: string }) {
  const [imageError, setImageError] = useState(false);

  const fallbackImageUrl = '/no-image.png';
  
  return (
    <a href={ src } title={alt} target="_blank" rel="noopener noreferrer">
      <img 
        src={imageError ? fallbackImageUrl : src} 
        alt={alt} 
        className={className}
        onError={() => setImageError(true)}
      />
    </a>
  );
}
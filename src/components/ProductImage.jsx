import { useState } from 'react'
const DEFAULT_IMAGE = '/default-product.webp'

export default function ProductImage({ src, alt, className = '', fallback = true, onError }) {
  const hasSource = typeof src === 'string' && src.trim()
  const [failedSource, setFailedSource] = useState('')
  const [loadedSource, setLoadedSource] = useState('')

  const imageSrc = fallback && (failedSource === src || !hasSource) ? DEFAULT_IMAGE : src
  const loading = Boolean(hasSource) && loadedSource !== src && failedSource !== src

  return (
    <div className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-slate-50 ${className}`}>
      {loading ? (
        <div className="absolute inset-0 animate-pulse bg-slate-200" />
      ) : null}
      <img
        src={imageSrc || undefined}
        alt={alt || 'Product image'}
        loading="lazy"
        className="h-full w-full max-h-full max-w-full rounded-2xl object-contain transition duration-300 hover:scale-[1.02]"
        onLoad={() => setLoadedSource(src)}
        onError={() => {
          setLoadedSource(src)
          if (fallback && imageSrc !== DEFAULT_IMAGE) setFailedSource(src)
          onError?.()
        }}
      />
    </div>
  )
}

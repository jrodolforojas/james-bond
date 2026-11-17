import { useEffect, useState } from 'react';
import { loadArchivePhoto } from './photo';

const cache = new Map<string, Promise<string>>();

function archiveUrl(src: string): Promise<string> {
  const cached = cache.get(src);
  if (cached) return cached;
  const pending = loadArchivePhoto(src).then((canvas) => canvas.toDataURL('image/jpeg', 0.85));
  cache.set(src, pending);
  return pending;
}

export function useArchivePhoto(src: string | null | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!src) return;
    let active = true;
    archiveUrl(src)
      .then((result) => {
        if (active) setUrl(result);
      })
      .catch(() => cache.delete(src));
    return () => {
      active = false;
    };
  }, [src]);
  return url;
}

import { useEffect, useState } from 'react';

export function useDelayedReady(delayMs = 100): boolean {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  return isReady;
}

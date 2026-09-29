import { useEffect, useRef, useState } from 'react';

interface UseHLSVideoOptions {
  /** Skip the network entirely on small screens / data-saver connections. */
  disableOnSmallScreens?: boolean;
  smallScreenMaxWidth?: number;
}

function shouldSkipVideo(disableOnSmallScreens: boolean, maxWidth: number): boolean {
  if (typeof window === 'undefined') return true;

  if (disableOnSmallScreens && window.innerWidth <= maxWidth) return true;

  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;

  if (connection?.saveData) return true;

  return false;
}

/**
 * Plays an HLS stream, loading hls.js (~185 kB gzip) only when it is actually
 * needed and always destroying the instance on unmount.
 */
export function useHLSVideo(
  src: string,
  { disableOnSmallScreens = true, smallScreenMaxWidth = 640 }: UseHLSVideoOptions = {}
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<{ destroy: () => void } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);

    const attach = async () => {
      if (shouldSkipVideo(disableOnSmallScreens, smallScreenMaxWidth)) {
        // Poster gradient stands in; no video bytes are fetched.
        setIsReady(true);
        return;
      }

      // Native HLS (Safari / iOS) — no library needed.
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        video.addEventListener(
          'loadedmetadata',
          () => {
            void video.play().catch(() => undefined);
            setIsReady(true);
          },
          { once: true }
        );
        return;
      }

      try {
        const { default: Hls } = await import('hls.js');
        if (cancelled) return;

        if (!Hls.isSupported()) {
          setIsReady(true);
          return;
        }

        const hls = new Hls({ enableWorker: true, lowLatencyMode: true, capLevelToPlayerSize: true });
        hlsRef.current = hls;

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          void video.play().catch(() => undefined);
          setIsReady(true);
        });

        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            hls.destroy();
            hlsRef.current = null;
            setIsReady(true); // fall back to the gradient poster
          }
        });

        hls.loadSource(src);
        hls.attachMedia(video);
      } catch {
        setIsReady(true);
      }
    };

    void attach();

    return () => {
      cancelled = true;
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      video.removeAttribute('src');
      video.load();
    };
  }, [src, disableOnSmallScreens, smallScreenMaxWidth]);

  return { videoRef, isPlaying, isReady };
}

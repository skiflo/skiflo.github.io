import { useEffect, useId, useRef, useState } from "react";
import "./HeroScene.css";

/** Scanline pattern spacing from the app icon grid (485×485). */
const SCANLINE_GRID = 485;
const SCANLINE_YS = [51.5, 149.1, 246.7, 344.3, 441.9] as const;

/** Opacity blend length between hero clips. */
const HERO_VIDEO_CROSSFADE_S = 1.4;
/** Start fetching the next clip this many seconds before the crossfade. */
const HERO_VIDEO_PREFETCH_LEAD_S = 10;

const HERO_VIDEO_CLIPS = [
  { src: "/hero/hero-ski-a.mp4", poster: "/hero/hero-ski-a-poster.jpg", eager: true },
  { src: "/hero/hero-ski-b.mp4", poster: "/hero/hero-ski-b-poster.jpg", eager: false },
] as const;

function isVideoReadyToPlay(video: HTMLVideoElement) {
  return video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA;
}

function ScanlineLayer({ patternId, className }: { patternId: string; className?: string }) {
  return (
    <svg className={className} preserveAspectRatio="none" aria-hidden>
      <defs>
        <pattern
          id={patternId}
          patternUnits="userSpaceOnUse"
          width={SCANLINE_GRID}
          height={SCANLINE_GRID}
        >
          {SCANLINE_YS.map((y) => (
            <line
              key={y}
              x1={0}
              y1={y}
              x2={SCANLINE_GRID}
              y2={y}
              stroke="var(--color-signal-cyan)"
              strokeOpacity={0.24}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

function ScanlineLayerBright({ patternId, className }: { patternId: string; className?: string }) {
  return (
    <svg className={className} preserveAspectRatio="none" aria-hidden>
      <defs>
        <pattern
          id={patternId}
          patternUnits="userSpaceOnUse"
          width={SCANLINE_GRID}
          height={SCANLINE_GRID}
        >
          {SCANLINE_YS.map((y) => (
            <line
              key={y}
              x1={0}
              y1={y}
              x2={SCANLINE_GRID}
              y2={y}
              stroke="var(--color-signal-cyan)"
              strokeOpacity={0.68}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

type CrossfadePhase = { from: 0 | 1; to: 0 | 1; animate: boolean };

function heroVideoClass(index: number, frontIndex: number, crossfade: CrossfadePhase | null) {
  const base = "hero-scene__video";
  if (crossfade) {
    if (index === crossfade.from) {
      return `${base} hero-scene__video--from${crossfade.animate ? " hero-scene__video--from-out" : ""}`;
    }
    if (index === crossfade.to) {
      return `${base} hero-scene__video--to${crossfade.animate ? " hero-scene__video--to-in" : ""}`;
    }
    return base;
  }
  return `${base}${index === frontIndex ? " hero-scene__video--active" : ""}`;
}

function HeroCrossfadeVideos() {
  const videoRefs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)];
  const [frontIndex, setFrontIndex] = useState<0 | 1>(0);
  const [crossfade, setCrossfade] = useState<CrossfadePhase | null>(null);
  const frontIndexRef = useRef<0 | 1>(0);
  const crossfadeRef = useRef<CrossfadePhase | null>(null);
  const fetchStartedRef = useRef([true, false]);

  useEffect(() => {
    frontIndexRef.current = frontIndex;
  }, [frontIndex]);

  useEffect(() => {
    crossfadeRef.current = crossfade;
  }, [crossfade]);

  useEffect(() => {
    const v0 = videoRefs[0].current;
    const v1 = videoRefs[1].current;
    if (!v0 || !v1) return;
    const videos = [v0, v1] as const;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const beginFetch = (clipIndex: number) => {
      if (fetchStartedRef.current[clipIndex]) return;
      fetchStartedRef.current[clipIndex] = true;

      const video = videos[clipIndex];
      const clip = HERO_VIDEO_CLIPS[clipIndex];
      if (!clip.eager && !video.src) {
        video.src = clip.src;
        video.load();
      }
    };

    const swapTo = (nextIndex: 0 | 1) => {
      const fromIndex = frontIndexRef.current;
      if (nextIndex === fromIndex || crossfadeRef.current) return;

      const from = videos[fromIndex];
      const to = videos[nextIndex];
      if (!from || !to) return;

      beginFetch(nextIndex);

      const runSwap = () => {
        to.currentTime = 0;
        void from.play().catch(() => {});
        void to.play().catch(() => {});

        setCrossfade({ from: fromIndex, to: nextIndex, animate: false });

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setCrossfade({ from: fromIndex, to: nextIndex, animate: true });
          });
        });

        window.setTimeout(() => {
          from.pause();
          frontIndexRef.current = nextIndex;
          setFrontIndex(nextIndex);
          setCrossfade(null);
        }, HERO_VIDEO_CROSSFADE_S * 1000 + 80);
      };

      if (!isVideoReadyToPlay(to)) {
        to.addEventListener("canplay", () => runSwap(), { once: true });
        return;
      }

      runSwap();
    };

    const cleanups = videos.map((video, index) => {
      const onTimeUpdate = () => {
        if (motion.matches || crossfadeRef.current || frontIndexRef.current !== index) return;

        const duration = video.duration;
        if (!Number.isFinite(duration)) return;

        const remaining = duration - video.currentTime;
        const nextIndex = (1 - index) as 0 | 1;

        if (remaining <= HERO_VIDEO_PREFETCH_LEAD_S + HERO_VIDEO_CROSSFADE_S) {
          beginFetch(nextIndex);
        }

        if (remaining <= HERO_VIDEO_CROSSFADE_S + 0.15) {
          swapTo(nextIndex);
        }
      };

      const onEnded = () => {
        if (crossfadeRef.current || frontIndexRef.current !== index) return;
        swapTo((1 - index) as 0 | 1);
      };

      video.addEventListener("timeupdate", onTimeUpdate);
      video.addEventListener("ended", onEnded);
      return () => {
        video.removeEventListener("timeupdate", onTimeUpdate);
        video.removeEventListener("ended", onEnded);
      };
    });

    const syncMotion = () => {
      if (motion.matches) {
        videos.forEach((video) => video.pause());
        return;
      }
      const front = frontIndexRef.current;
      videos.forEach((video, index) => {
        video.playbackRate = 1;
        if (index === front && !crossfadeRef.current) {
          void video.play().catch(() => {});
        } else if (!crossfadeRef.current) {
          video.pause();
        }
      });
    };

    syncMotion();
    motion.addEventListener("change", syncMotion);

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      motion.removeEventListener("change", syncMotion);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refs stable; wire listeners once on mount
  }, []);

  return (
    <>
      {HERO_VIDEO_CLIPS.map((clip, index) => (
        <video
          key={clip.src}
          ref={videoRefs[index]}
          className={heroVideoClass(index as 0 | 1, frontIndex, crossfade)}
          muted
          playsInline
          preload={clip.eager ? "auto" : "none"}
          poster={clip.poster}
          {...(clip.eager ? {} : { "data-lazy-src": clip.src })}
        >
          {clip.eager ? <source src={clip.src} type="video/mp4" /> : null}
        </video>
      ))}
    </>
  );
}

/** Hero backdrop — crossfaded ski video, ticks, scan lines, cursor glow (CSS vars from `.hero`). */
export function HeroScene() {
  const patternBase = useId();
  const patternBright = useId();

  return (
    <div className="hero-scene" aria-hidden>
      <div className="hero-scene__media">
        <HeroCrossfadeVideos />
        <div className="hero-scene__video-grade" />
      </div>

      <div className="hero-scene__textures">
        <div className="hero-scene__ticks hero-scene__ticks--base" />
        <div className="hero-scene__ticks hero-scene__ticks--bright" />
        <div className="hero-scene__scan hero-scene__scan--base">
          <ScanlineLayer patternId={patternBase} className="hero-scene__scanlines" />
        </div>
        <div className="hero-scene__scan hero-scene__scan--bright">
          <ScanlineLayerBright patternId={patternBright} className="hero-scene__scanlines" />
        </div>
      </div>

      <div className="hero-scene__vignette" />
    </div>
  );
}

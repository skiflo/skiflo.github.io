import "./SkiFloLogo.css";

const BRAND_NAME = "SKI FLO";

const FLOWY_VIEWBOX = "0 0 468 349";
const FLOWY_PATH =
  "M184.097 41.5C188.331 34.1667 198.915 34.1667 203.149 41.5L266.762 151.681C274.164 167.5 292.038 197.904 247.664 218.5C207.292 237.239 179.128 252.093 180.024 292.276C180.174 298.999 175.116 305 168.391 305H51.0165C42.5487 305 37.2563 295.833 41.4902 288.5L184.097 41.5ZM266.762 151.681L297.072 99.3114C301.309 91.9917 311.877 91.9917 316.113 99.3115L425.604 288.49C429.848 295.823 424.556 305 416.083 305H287.843C283.23 305 278.993 302.129 277.916 297.644C270.528 266.868 294.691 255.59 301.664 230.494C311.716 194.317 292.858 162.237 266.762 151.681Z";
const FLOWY_DOT = { cx: 378, cy: 52, r: 24 };
type SkiFloLogoProps = {
  layout?: "stacked" | "horizontal";
  theme?: "dark" | "light";
  glitchName?: boolean;
  className?: string;
};

function BrandName({ glitch }: { glitch: boolean }) {
  if (!glitch) {
    return <span className="brand-lockup__name">{BRAND_NAME}</span>;
  }

  return (
    <span className="brand-lockup__name brand-lockup__name--glitch" aria-hidden="true">
      {[...BRAND_NAME].map((char, index) => {
        const display = char === " " ? "\u00a0" : char;
        return (
          <span key={`${index}-${char}`} className="brand-lockup__glyph" data-char={display}>
            {display}
          </span>
        );
      })}
    </span>
  );
}

function FlowyMark() {
  return (
    <svg
      className="brand-lockup__mark"
      viewBox={FLOWY_VIEWBOX}
      aria-hidden
      focusable="false"
    >
      <path className="brand-lockup__mark-shape" d={FLOWY_PATH} />
      <circle className="brand-lockup__mark-dot" cx={FLOWY_DOT.cx} cy={FLOWY_DOT.cy} r={FLOWY_DOT.r} />
    </svg>
  );
}

export function SkiFloLogo({
  layout = "stacked",
  theme = "dark",
  glitchName = false,
  className,
}: SkiFloLogoProps) {
  const rootClass = ["brand-lockup", `brand-lockup--${layout}`, `brand-lockup--${theme}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass} role="img" aria-label="SKI FLO — Real-time mountain telemetry">
      <FlowyMark />
      <div className="brand-lockup__text">
        <BrandName glitch={glitchName} />
        <span className="brand-lockup__tagline">Real-time mountain telemetry</span>
      </div>
    </div>
  );
}

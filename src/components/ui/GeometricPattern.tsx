import { useId } from "react";

type Props = {
  className?: string;
  /** Tile size in px. */
  size?: number;
  opacity?: number;
};

/**
 * Eight-pointed star (khatam) lattice drawn in hairlines — the geometry of
 * Cairene woodwork and stone, used as a quiet architectural texture.
 */
export function GeometricPattern({ className, size = 88, opacity = 0.18 }: Props) {
  const id = useId().replace(/:/g, "");
  const s = size;
  const c = s / 2;
  const a = s * 0.25; // half-side of the axis-aligned square
  const d = a * Math.SQRT2; // half-diagonal of the rotated square
  const sq = `${c - a},${c - a} ${c + a},${c - a} ${c + a},${c + a} ${c - a},${c + a}`;
  const dia = `${c},${c - d} ${c + d},${c} ${c},${c + d} ${c - d},${c}`;
  const r = a * 0.42;
  const oct = Array.from({ length: 8 }, (_, i) => {
    const t = (Math.PI / 4) * i + Math.PI / 8;
    return `${(c + r * Math.cos(t)).toFixed(2)},${(c + r * Math.sin(t)).toFixed(2)}`;
  }).join(" ");

  return (
    <svg className={className} aria-hidden="true" width="100%" height="100%" style={{ opacity }}>
      <defs>
        <pattern id={`khatam-${id}`} width={s} height={s} patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="0.75" vectorEffect="non-scaling-stroke">
            <polygon points={sq} />
            <polygon points={dia} />
            <polygon points={oct} />
            <line x1={c} y1={0} x2={c} y2={c - d} />
            <line x1={c} y1={c + d} x2={c} y2={s} />
            <line x1={0} y1={c} x2={c - d} y2={c} />
            <line x1={c + d} y1={c} x2={s} y2={c} />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#khatam-${id})`} />
    </svg>
  );
}

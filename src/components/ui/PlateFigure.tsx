import { plateNumber, plates, type PlateKey } from "@/content/plates";
import { ImageReveal } from "./ImageReveal";

type Props = {
  plate: PlateKey;
  sizes: string;
  ratio?: string;
  position?: string;
  zoom?: number;
  parallax?: number;
  tone?: "none" | "soft" | "deep";
  framed?: boolean;
  caption?: boolean;
  className?: string;
  priority?: boolean;
};

/** One of the architectural plates, revealed and captioned like a folio plate. */
export function PlateFigure({ plate, caption = true, framed = true, tone = "soft", ...rest }: Props) {
  const p = plates[plate];
  return (
    <ImageReveal
      src={p.image}
      alt={p.alt}
      caption={caption ? p.caption : undefined}
      plate={caption ? plateNumber(plate) : undefined}
      framed={framed}
      tone={tone}
      {...rest}
    />
  );
}

import type { ResolvedImage } from "@/lib/cms/images";
import { ImageReveal } from "./ImageReveal";

type Props = {
  image: ResolvedImage;
  sizes: string;
  ratio?: string;
  /** Overrides the image's own framing. */
  position?: string;
  zoom?: number;
  parallax?: number;
  tone?: "none" | "soft" | "deep";
  framed?: boolean;
  caption?: boolean;
  className?: string;
  priority?: boolean;
};

/** An architectural plate (or uploaded image), revealed and captioned like a folio plate. */
export function PlateFigure({ image, caption = true, framed = true, tone = "soft", position, ...rest }: Props) {
  return (
    <ImageReveal
      src={image.src}
      alt={image.alt}
      caption={caption && image.caption ? image.caption : undefined}
      plate={caption && image.plateNo ? image.plateNo : undefined}
      framed={framed}
      tone={tone}
      position={position ?? image.position}
      {...rest}
    />
  );
}

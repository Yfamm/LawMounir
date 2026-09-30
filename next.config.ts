import type { NextConfig } from "next";

// Uploaded images are served from the Supabase Storage "media" bucket.
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL) : null;

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 85],
    formats: ["image/avif", "image/webp"],
    remotePatterns: supabase
      ? [
          {
            protocol: supabase.protocol.replace(":", "") as "http" | "https",
            hostname: supabase.hostname,
            port: supabase.port,
            pathname: "/storage/v1/object/public/media/**",
          },
        ]
      : [],
    // Local development only: lets the optimizer fetch from a Supabase stack on
    // 127.0.0.1. Never set IMAGES_ALLOW_LOCAL_IP in production.
    dangerouslyAllowLocalIP: process.env.IMAGES_ALLOW_LOCAL_IP === "true",
  },
};

export default nextConfig;

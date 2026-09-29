import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Unsplash-hosted placeholders for pages awaiting real photography — see the comments
    // near each usage. Swap for local/CMS assets once the client supplies real images.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

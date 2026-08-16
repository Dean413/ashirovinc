import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [

      {
        protocol: "https",
        hostname: "cmynewxgfrvowdbiryul.supabase.co",
        pathname: "/storage/v1/object/public/Laptops/**",
      },

      {
        protocol: 'https',
        hostname: 'th.bing.com',
        port: '',

      },

      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
      },

      {
        protocol: 'https',
        hostname: 'cmynewxgfrvowdbiryul.supabase.co',
        port: '',
      }
    ]
  }
}


export default nextConfig;


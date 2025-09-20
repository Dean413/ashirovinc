import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {remotePatterns: [
    {
      protocol: 'https',
      hostname: 'cmynewxgfrvowdbiryul.supabase.co',
      port: '',
      pathname: '/storage/v1/object/public/Laptops/LAPTOP_PICTURES/**',
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


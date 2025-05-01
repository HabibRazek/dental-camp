import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images:{
    domains: [
    
    "utfs.io",
    "avatars.githubusercontent.com",
    "lh3.googleusercontent.com",
    "www.francisdemange.net",
    "encrypted-tbn0.gstatic.com",
    "obaeyuhk7k.ufs.sh",
  ]},
  
};

export default nextConfig;

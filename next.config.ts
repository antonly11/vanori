import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Allow this Mac's LAN address when testing the development app on a phone.
  allowedDevOrigins: ["192.168.1.200"],
};

export default nextConfig;

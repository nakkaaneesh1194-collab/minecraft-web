import type { NextConfig } from "next";
const scriptSource = process.env.NODE_ENV === "production" ? "script-src 'self' 'unsafe-inline'" : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";
const nextConfig: NextConfig = {
  headers: async () => [{ source: "/(.*)", headers: [
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
    { key: "Content-Security-Policy", value: `default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; connect-src 'self' https://login.microsoftonline.com https://graph.microsoft.com https://*.xboxlive.com https://api.minecraftservices.com; ${scriptSource}` },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "X-Content-Type-Options", value: "nosniff" }
  ] }]
};
export default nextConfig;

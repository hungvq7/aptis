/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // data-seed/ is only read via a runtime-computed fs path (lib/data/mock/store.ts),
  // which Next's output file tracing can't statically discover — without this it
  // gets silently dropped from the Vercel serverless bundle, so cold starts find
  // no seed file and every collection starts truly empty (including users.json).
  outputFileTracingIncludes: {
    "/**": ["./data-seed/**"],
  },
}

export default nextConfig

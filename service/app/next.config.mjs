/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
    cpus: 1,
  },
  webpack(config, { isServer }) {
    if (isServer) {
      if (Array.isArray(config.resolve.alias)) {
        config.resolve.alias.push({ name: "msw/browser", alias: false })
      } else {
        config.resolve.alias["msw/browser"] = false
      }
    } else {
      if (Array.isArray(config.resolve.alias)) {
        config.resolve.alias.push({ name: "msw/node", alias: false })
      } else {
        config.resolve.alias["msw/node"] = false
      }
    }

    config.output.filename = config.output.filename.replace(
      "[chunkhash]",
      "[contenthash]",
    )

    return {
      ...config,
      devtool: process.env.NEXT_PUBLIC_TEST ? "inline-source-map" : false,
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "*.s3.ap-northeast-2.amazonaws.com",
      },
    ],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  productionBrowserSourceMaps: !!process.env.NEXT_PUBLIC_TEST,
}

export default nextConfig

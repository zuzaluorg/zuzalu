import remarkGfm from "remark-gfm";
import createMDX from "@next/mdx";
import nextPWA from "next-pwa";


const withPWA = nextPWA({
    dest: "public",
    register: true,
    skipWaiting: true
})

const withMDX = createMDX({
    extension: /\.mdx?$/,
    options: {
      // If you use remark-gfm, you'll need to use next.config.mjs
      // as the package is ESM only
      // https://github.com/remarkjs/remark-gfm#install
      remarkPlugins: [remarkGfm],
      rehypePlugins: [],
      // If you use `MDXProvider`, uncomment the following line.
      // providerImportSource: "@mdx-js/react",
    },
  })

export default withMDX(withPWA({
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "i.imgur.com",
                port: ""
            },
            {
                protocol: "https",
                hostname: "polcxtixgqxfuvrqgthn.supabase.co",
                port: ""
            }
        ]
    },
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true
    },
    experimental: {
        esmExternals: false
    },
    env: {
        KEY_TO_API: process.env.KEY_TO_API
    },
    webpack(config, options) {
        if (!options.isServer) {
            config.resolve.fallback.fs = false
        }
        config.experiments = { asyncWebAssembly: true, layers: true }

        // Add a new rule for TypeScript files
        config.module.rules.push({
            test: /\.(ts|tsx)$/,
            exclude:
                /node_modules\/(?!(@pcd\/passport-interface|@pcd\/semaphore-signature-pcd|@pcd\/pcd-types|@pcd\/semaphore-group-pcd|@pcd\/semaphore-identity-pcd|@pcd\/semaphore-group-pcd))/,
            use: {
                loader: "ts-loader",
                options: {
                    configFile: "tsconfig.json",
                    transpileOnly: true
                }
            }
        })

        return config
    }
}))

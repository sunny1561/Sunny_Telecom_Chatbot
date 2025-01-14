/** @type {import('next').NextConfig} */
// const nextConfig = {
//     // reactStrictMode: true,
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'img.freepik.com',
//       },
//     ],
//   },
// };

const nextConfig = {
  reactStrictMode: true, // Uncomment if you want React's strict mode.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude `onnxruntime-node` from being bundled by Webpack.
      config.externals.push({
        'onnxruntime-node': 'commonjs onnxruntime-node',
      });
    }
    return config;
  },
};

export default nextConfig;


// /** @type {import('next').NextConfig} */
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

// export default nextConfig;
const nextConfig = {
    webpack: (config) => {
        config.module.rules.push({
            test: /\.node$/,
            use: 'node-loader',
        });
        return config;
    },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // async headers() {
  //   return [
  //     {
  //       source: "/api/:path*",
  //       headers: [
  //         { key: "Access-Control-Allow-Origin", value: "*" }, // Update with specific domains if needed
  //         {
  //           key: "Access-Control-Allow-Methods",
  //           value: "GET, POST, PUT, DELETE",
  //         },
  //         {
  //           key: "Access-Control-Allow-Headers",
  //           value: "Content-Type, Authorization",
  //         },
  //       ],
  //     },
  //   ];
  // },
  // Modify Webpack only if necessary
  webpack: (config, { isServer }) => {
    if (isServer) {
      return config;
    }

    // Example of modifying Webpack config
    config.stats = "verbose"; // Reduce Webpack logs (optional)
    return config;
  },

  // Rewrite API requests to a different backend server
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'http://localhost:5000/api/:path*', // Proxy to backend
  //     },
  //   ];
  // },
};

module.exports = nextConfig;

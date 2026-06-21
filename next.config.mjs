const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: process.cwd(),
  },
  allowedDevOrigins: ['192.168.0.106', 'localhost'],  
};

export default nextConfig;
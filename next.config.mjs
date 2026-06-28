import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: process.cwd(),
  },
  allowedDevOrigins: ['192.168.0.106', 'localhost'],  
};

export default withNextIntl(nextConfig);
const dev = process.env.NODE_ENV !== 'production';
const server = dev ? 'http://localhost:3000' : process.env.NEXT_APP_DOMAIN || 'http://localhost:3000';
module.exports = [
    { 
      key: "Access-Control-Allow-Origin", 
      value: server 
    },
    {
      key: 'X-DNS-Prefetch-Control',
      value: 'on',
    },
    {
      key: 'Strict-Transport-Security',
      value: 'max-age=63072000; includeSubDomains; preload',
    },
    {
      key: 'X-Content-Type-Options',
      value: 'nosniff',
    },
    {
      key: 'X-Frame-Options',
      // value: 'SAMEORIGIN',
      value: 'DENY',
    },
    {
      key: 'Content-Security-Policy',
      value: "frame-ancestors 'none'",
    },
    {
      key: 'X-XSS-Protection',
      value: '1; mode=block',
    },
    {
      key: 'Referrer-Policy',
      value: 'origin-when-cross-origin',
    },
    {
      key: 'Permissions-Policy',
      value: 'geolocation=*',
    },
  ];

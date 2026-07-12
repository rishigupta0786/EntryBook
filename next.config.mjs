/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.MOBILE_BUILD === 'true' ? 'export' : undefined,
  transpilePackages: [
    '@mui/material',
    '@mui/icons-material',
    '@mui/x-data-grid',
    '@emotion/react',
    '@emotion/styled',
    'prop-types'
  ]
};

export default nextConfig;

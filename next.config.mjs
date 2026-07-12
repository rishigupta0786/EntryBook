/** @type {import('next').NextConfig} */
const nextConfig = {
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

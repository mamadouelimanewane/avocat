import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    // CRITIQUE : Il faut absolument transpiler ce package pour qu'il soit traité comme ESM
    transpilePackages: ['@react-pdf/renderer', 'react-day-picker', 'date-fns'],
    experimental: {
        serverComponentsExternalPackages: ['@prisma/client'],
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },
    webpack: (config) => {
        config.resolve.alias.canvas = false;
        config.resolve.alias.encoding = false;
        return config;
    },
};

export default nextConfig;

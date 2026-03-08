import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      // /maths is the new hub — /practice still works but redirects there
      {
        source: '/practice',
        destination: '/maths',
        permanent: true,
      },
      // Keep /worksheets working but link from /maths
      // (No redirect needed — /worksheets stays as-is, /maths links to it)
    ];
  },
};

export default nextConfig;

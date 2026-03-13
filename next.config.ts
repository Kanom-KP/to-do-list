import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // ปิด strict mode เพื่อซ่อนคำเตือน UNSAFE_componentWillReceiveProps จาก swagger-ui-react (ModelCollapse)
  reactStrictMode: false,
};

export default nextConfig;

import type { NextConfig } from "next";
import { ENVConfig } from "./lib/utils";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SITE_URL: ENVConfig.getAppURL(),
  },
};

export default nextConfig;

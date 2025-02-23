import type { NextConfig } from "next";
import { getAppURLBYENV } from "./lib/utils";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SITE_URL: getAppURLBYENV(),
  },
};

export default nextConfig;

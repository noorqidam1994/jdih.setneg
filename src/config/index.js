const dev = process.env.NODE_ENV !== "production";

export const server = dev
  ? "http://localhost:3000"
  : process.env.NEXT_APP_DOMAIN || "http://localhost:3000";

import { Config } from "./config.interface";

const config: Config = {
  nest: {
    port: 3005,
    apiUrl: process.env.API_URL,
  },
  cors: {
    enabled: true,
  },
  swagger: {
    enabled: true,
    title: "Cat API",
    description: "API endpoints for cat app",
    version: "1.0.0",
    path: "api",
    persistAuthorization: true,
  },
  security: {
    expiresIn: "30d",
    refreshIn: "90d",
    bcryptSaltOrRound: 10,
  },
  throttle: {
    ttl: 3,
    limit: 18000000000,
    ignoreUserAgents: [],
  },
};

export default (): Config => config;

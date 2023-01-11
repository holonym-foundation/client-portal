export const idServerUrl =
  process.env.NODE_ENV == "development"
    ? "http://localhost:3000"
    : "https://id-server.holonym.io";

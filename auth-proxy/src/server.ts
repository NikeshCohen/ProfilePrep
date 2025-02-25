import express from "express";

import { handleProxyRequest } from "./proxyHandler";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Proxy endpoint for handling OAuth callbacks
app.all("/auth/callback", handleProxyRequest);

// Start the proxy server
const PORT = process.env.PORT || 3001; // Use a different port than Next.js
app.listen(PORT, () => {
  console.log(`Auth proxy running on port ${PORT}`);
});

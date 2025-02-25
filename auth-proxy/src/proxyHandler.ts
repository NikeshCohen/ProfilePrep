import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import http from "http";
import https from "https";

import { handleProxyError, parseRedirectUri } from "./utils";

export const handleProxyRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const redirectUri = parseRedirectUri(req);
    if (!redirectUri) {
      res.status(400).send("Missing redirect_uri");
    }

    const url = new URL(redirectUri!);
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === "https:" ? 443 : 80),
      path: url.pathname + url.search,
      method: req.method,
      headers: req.headers,
    };

    const protocol = url.protocol === "https:" ? https : http;
    const proxyReq = protocol.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    proxyReq.on("error", (error) => handleProxyError(error, res));

    req.pipe(proxyReq, { end: true });
  },
);

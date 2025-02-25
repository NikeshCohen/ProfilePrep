import { Request, Response } from "express";

export const parseRedirectUri = (req: Request): string | null => {
  return (
    req.query.redirect_uri || JSON.parse(req.query.state as string).redirect_uri
  );
};

export const handleProxyError = (error: Error, res: Response) => {
  console.error("Proxy error:", error);
  res.status(500).send("Proxy error");
};

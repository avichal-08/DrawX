import express, { Request, Response } from "express";

const app: express.Application = express();

app.use(express.json({ limit: "100kb" }));

app.get("/check", (_req: Request, res: Response) => {
  return res.status(200).json({ message: "Server Running Fine" });
});

export default app;

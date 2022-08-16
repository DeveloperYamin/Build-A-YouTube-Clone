import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { processRequestBody } from "zod-express-middleware";
import requireUser from "../../middleware/requireUser";

import { registerUserHandler } from "./user.controller";
import { registerUserSchema } from "./user.schema";

const router = express.Router();

router.get("/", requireUser, (req: Request, res: Response) => {
  return res.locals.user
    ? res.send(res.locals.user)
    : res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");
});

router.post(
  "/",
  processRequestBody(registerUserSchema.body),
  registerUserHandler
);

export default router;

import { Router } from "express";
import { usersRouter } from "./user";

const router = Router();

router.use(usersRouter);

export default router;
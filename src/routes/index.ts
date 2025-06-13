import { Router } from "express";
import { productsRouter } from "./products";
import { usersRouter } from "./users";
import { authRouter } from "./auth";

const router = Router();

router.use('/users', usersRouter);
router.use('/products', productsRouter)
router.use('/auth', authRouter)

export default router;
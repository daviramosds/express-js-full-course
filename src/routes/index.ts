import { Router } from "express";
import { productsRouter } from "./products";
import { usersRouter } from "./users";

const router = Router();

router.use('/users', usersRouter);
router.use('/products', productsRouter)

export default router;
import { Request, Response, Router } from "express";
export const productsRouter = Router()

productsRouter.get('/', (req: Request, res: Response) => {

  if (req.cookies.hello) {
    res.send({msg: 'the cookie does exist' })
  }

  res.send({msg: 'hello' })
})
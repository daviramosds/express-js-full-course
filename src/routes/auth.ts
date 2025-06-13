import { Router, Request, Response } from "express";
import passport from "passport";

export const authRouter = Router()

// @ts-ignore ---
authRouter.post('/', passport.authenticate('local'), (req: Request, res: Response) => {
  return res.send(req.session.passport)
});

// @ts-ignore ---
authRouter.get('/', (req: Request, res: Response) => {
  return req.user ? res.status(200).send(req.user) : res.sendStatus(401)
});

// @ts-ignore ---
authRouter.post('/logout', (req: Request, res: Response) => {
  if (!req.user) return res.sendStatus(401)
  req.logout((err) => {
    if (err) return res.sendStatus(400)
    return res.send(200)
  })
});
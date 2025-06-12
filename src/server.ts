import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express, { Request, response, Response } from 'express';
import session from 'express-session';
import passport from 'passport';
import router from './routes';
import "./strategies/local";

const app = express();

dotenv.config()

app.use(express.json())
app.use(cookieParser())
app.use(session({
  secret: process.env.SESSION_SECRET as string,
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 60 * 60 * 1000
  }
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/api', router)

const PORT = process.env.PORT || 3000;

app.get('/api', (req: Request, res: Response) => {
  console.log(req.session)
  console.log(req.session.id)
  req.session.visited = true
  res.cookie('hello', 'world', { maxAge: 10000 })
  res.status(200).send('Hello, world');
});

// @ts-ignore ---
app.post('/api/auth', passport.authenticate('local'), (req: Request, res: Response) => {
  return res.send(req.session.passport)
});

// @ts-ignore ---
app.get('/api/auth/', (req: Request, res: Response) => {
  return req.user ? res.sendStatus(200) : res.sendStatus(401)
});

// @ts-ignore ---
app.post('/api/auth/logout', (req: Request, res: Response) => {
  if (!req.user) return res.sendStatus(401)
  req.logout((err) => {
    if (err) return response.sendStatus(400)
    return res.send(200)
  })
});

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

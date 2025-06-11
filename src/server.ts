import express, { Request, Response } from 'express';
import router from './routes';
import cookieParser from 'cookie-parser';
import session from 'express-session'
import dotenv from 'dotenv'
import { IAuthBody } from './types/users';
import { fakeUsers } from './utils/constants';

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
app.use('/api', router)

const PORT = process.env.PORT || 3000;

app.get('/api', (req: Request, res: Response) => {
  console.log(req.session)
  console.log(req.session.id)
  // @ts-ignore visited doest not exist in type
  req.session.visited = true
  res.cookie('hello', 'world', { maxAge: 10000 })
  res.status(200).send('Hello, world');
});

// @ts-ignore it is all as it shoud, so why?
app.post('/api/auth', (req: Request<object, object, IAuthBody>, res: Response) => {
  const { body: { username, password } } = req;

  if (!username || !password) return res.status(400).send({ msg: 'Invalid params' })

  const user = fakeUsers.find(user => user.username == username)
  if (!user || user?.password != password) return res.sendStatus(401)
    // @ts-ignore i am just trying things out
    req.session.user = user
    return res.send(user)
});

// @ts-ignore why shoudnt i return this? is it because it is a middleware?
app.get('/api/auth/', (req: Request, res: Response) => {
  // @ts-ignore user doest not exist on type x
  return req.session.user ? res.sendStatus(200) : res.sendStatus(401)
});

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

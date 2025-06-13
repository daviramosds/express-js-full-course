import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import session from 'express-session';
import passport from 'passport';
import router from './routes';
// import "./strategies/local";
import "./strategies/discord";
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';

dotenv.config()

const app = express();

const mongoUser = process.env.MONGO_ROOT_USERNAME;
const mongoPass = process.env.MONGO_ROOT_PASSWORD;
const dbName = process.env.MONGO_DB_NAME;

const mongoUri = `mongodb://${mongoUser}:${mongoPass}@localhost:27017/${dbName}`;

mongoose.connect(mongoUri, { authSource: 'admin' })
  .then(() => console.log('Database connected'))
  .catch(err => console.log('Error connecting to db', err))

app.use(express.json())
app.use(cookieParser())
app.use(session({
  secret: process.env.SESSION_SECRET as string,
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 60 * 60 * 1000
  },
  store: MongoStore.create({
    client: mongoose.connection.getClient()
  })
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

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

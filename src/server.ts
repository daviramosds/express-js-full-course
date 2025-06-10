import express, { Request, Response } from 'express';
import router from './routes';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json())
app.use(cookieParser())
app.use('/api', router)

const PORT = process.env.PORT || 3000;

app.get('/api', (req: Request, res: Response) => {
  res.cookie('hello', 'world', { maxAge: 10000 })
  res.status(200).send('Hello, world');
});


app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

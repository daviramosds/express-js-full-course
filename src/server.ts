import express, { Request, Response } from 'express';
import router from './routes';

const app = express();
app.use(express.json())

const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello, world');
});

app.use(router)

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

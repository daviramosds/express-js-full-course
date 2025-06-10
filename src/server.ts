import express, { Request, Response } from 'express';
import { ICreateUserBody, IUser, IUserQueryParams } from './types/users';

const app = express();
app.use(express.json())

const PORT = process.env.PORT || 3000;

const fakeUsers: IUser[] = [
  { id: 1, username: 'davirds', displayName: 'Davi R' },
  { id: 2, username: 'mariasilva', displayName: 'Maria Silva' },
  { id: 3, username: 'joaosantos', displayName: 'João Santos' },
  { id: 4, username: 'carolpires', displayName: 'Carolina Pires' },
  { id: 5, username: 'lucasf', displayName: 'Lucas Ferreira' },
  { id: 6, username: 'anapaula', displayName: 'Ana Paula' },
  { id: 7, username: 'pedroalves', displayName: 'Pedro Alves' },
  { id: 8, username: 'julianar', displayName: 'Juliana Ribeiro' },
  { id: 9, username: 'matheust', displayName: 'Matheus Teixeira' },
  { id: 10, username: 'lais.cruz', displayName: 'Laís Cruz' },
  { id: 11, username: 'rafael.moraes', displayName: 'Rafael Moraes' }
];

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello, world');
});

app.get('/api/users', (req: Request, res: Response) => {

  const { filter, value } = req.query as IUserQueryParams

  let filteredUsers: IUser[] = [...fakeUsers]

  if (filter && value) {
    switch (filter) {
      case 'username':
        filteredUsers = fakeUsers.filter(user => user.username.toLocaleLowerCase().includes(value.toLowerCase()))
        break;
      case 'displayName':
        filteredUsers = fakeUsers.filter(user => user.displayName.toLocaleLowerCase().includes(value.toLowerCase()))
        break;
      default:
        break
    }
  }

  res.status(200).send(filteredUsers);
});

app.get('/api/users/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const parsedId = parseInt(id);

  const user = fakeUsers.find((user: IUser) => user.id === parsedId);

  if (!user)  res.status(404).send({ message: 'User not found' });

  res.status(200).send(user);
});

// @ts-ignore
app.post('/api/users', (req: Request<{}, {}, ICreateUserBody>, res: Response) => {
  const { username, displayName } = req.body;

  if (!username || !displayName) {
    return res.status(400).json({ message: 'Username e Display Name são obrigatórios.' });
  }

  const newUser: IUser = {
    id: fakeUsers.length > 0 ? Math.max(...fakeUsers.map(u => u.id)) + 1 : 1,
    username,
    displayName
  };

  fakeUsers.push(newUser);

  return res.status(201).json(newUser);
})

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

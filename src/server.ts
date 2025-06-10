import express, { Request, Response } from 'express';
import { ICreateUserBody, IUser, IUserQueryParams } from './types/users';
import { fakeUsers } from './utils/constants';
import { resolveIndexByUserId } from './utils/middleware';

const app = express();
app.use(express.json())

const PORT = process.env.PORT || 3000;

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

// @ts-ignore i dont really know
app.post('/api/users', (req: Request<object, object, ICreateUserBody>, res: Response) => {
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

// @ts-ignore i dont really know
app.put('/api/users/:id', resolveIndexByUserId, (req: RequestFindUserIndex, res: Response) => {
  const { findUserIndex, body} = req

  const updatedUser = fakeUsers[findUserIndex] = { id: fakeUsers[findUserIndex].id, ...body }

  return res.status(200).json(updatedUser)
  
})

// @ts-ignore i dont really know
app.patch('/api/users/:id', resolveIndexByUserId, (req: resolveIndexByUserId, res: Response) => {
  const { findUserIndex, body} = req
  
  const updatedUser = fakeUsers[findUserIndex] = { ...fakeUsers[findUserIndex], ...body }

  return res.status(200).json(updatedUser)
  
})

// @ts-ignore i dont really know
app.delete('/api/users/:id', resolveIndexByUserId, (req: resolveIndexByUserId, res: Response) => {

  fakeUsers.splice(req.resolveIndexByUserId, 1)

  return res.status(200).json({
    msg: 'User removed'
  })
  
})

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

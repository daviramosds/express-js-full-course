import { Request, Response, Router } from 'express';
import { UsersController } from '../controllers/users';
import { User } from '../mongoose/schemas/user';
import { IUser, RequestFindUserIndex } from '../types/users';
import { hashPassword } from '../utils/helper';
import { getUsersValidatorSchema, patchUserValidatorSchema, updateUserValidatorSchema } from '../validators/user';
export const usersRouter = Router()

// @ts-ignore ---
usersRouter.get('/', async (req: Request, res: Response) => {

  req.sessionStore.get(req.sessionID, (err, sessionData) => {
    if (err) {
      throw err
    }

    console.log(sessionData)
  })

  const result = getUsersValidatorSchema.safeParse(req.query);

  if (!result.success) {
    console.log(result.error)
    return res.status(400).json({ errors: result.error.format() });
  }

  const { filter, value } = result.data;

  let filteredUsers = await User.find({}, { password: 0 })

  if (filter && value) {

    const filterKey = filter as keyof IUser;

    filteredUsers = filteredUsers.filter(user => {
      const fieldValue = user[filterKey];

      if (typeof fieldValue !== 'string') return false;

      return fieldValue.toLocaleLowerCase().includes(value.toLowerCase());
    });
  }

  return res.status(200).send(filteredUsers);
});

// @ts-ignore ---
usersRouter.get('/:id', UsersController.getUserById);


// @ts-ignore ---
usersRouter.post('', UsersController.createUser)

// @ts-ignore i dont really know
usersRouter.put('/:id', async (req: RequestFindUserIndex, res: Response) => {
  const { id } = req.params;

  if (!User.base.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: 'Invalid User ID format' });
  }

  const result = updateUserValidatorSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.format() });
  }
  const { password, ...updateFields } = result.data;

  if (password) {
    // @ts-ignore i am already checking if it exists
    updateFields.password = await hashPassword(password);
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    updateFields,
    { new: true, runValidators: true, select: '-password' }
  );

  if (!updatedUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json(updatedUser);
})

// @ts-ignore i dont really know
usersRouter.patch('/:id', async (req: resolveIndexByUserId, res: Response) => {
  const { id } = req.params;

  if (!User.base.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: 'Invalid User ID format' });
  }

  if (!User.base.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: 'Invalid User ID format' });
  }

  const result = patchUserValidatorSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.format() });
  }
  const { password, ...updateFields } = result.data;

  if (password) {
    // @ts-ignore i am already checking if it exists
    updateFields.password = await hashPassword(password);
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    updateFields,
    { new: true, runValidators: true, select: '-password' }
  );

  if (!updatedUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json(updatedUser);
})

// @ts-ignore i dont really know
usersRouter.delete('/:id', async (req: resolveIndexByUserId, res: Response) => {
  const { id } = req.params;

  if (!User.base.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: 'Invalid User ID format' });
  }

  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({ message: 'User removed successfully' });
})

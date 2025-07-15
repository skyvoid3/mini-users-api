import { Router } from 'express';
import { getUsers, getUserById, createUser, deleteUserById, changeUserInfoById } from '../controllers/usersController';
import { basicAuth } from '../middleware/auth';

const usersRouter = Router();

usersRouter.get('/', getUsers);
usersRouter.get('/:id', getUserById);
usersRouter.post('/', createUser);
usersRouter.delete('/:id', basicAuth, deleteUserById);
usersRouter.patch('/:id', basicAuth, changeUserInfoById);

export default usersRouter;

import { Router } from 'express';
import {
    getUsers,
    getUserById,
    createUser,
    deleteUserById,
    changeUserInfoById,
    getUserByUsername,
} from '../controllers/usersController';
import { basicAuth } from '../middleware/auth';

const usersRouter = Router();

usersRouter.get('/', getUsers);
usersRouter.get('/id/:id', getUserById);
usersRouter.get('/:username', getUserByUsername);
usersRouter.post('/', createUser);
usersRouter.delete('/:id', basicAuth, deleteUserById);
usersRouter.patch('/:id', basicAuth, changeUserInfoById);

export default usersRouter;

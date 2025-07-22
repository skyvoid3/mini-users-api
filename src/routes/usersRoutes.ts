import { Router } from 'express';
import {
    getUsers,
    getUserById,
    deleteUserById,
    changeUserInfoById,
    getUserByUsername,
} from '../controllers/usersController';
import { JWTAuth } from '../middleware/auth';

const usersRouter = Router();

usersRouter.get('/', JWTAuth, getUsers);
usersRouter.get('/id/:id', getUserById);
usersRouter.get('/:username', getUserByUsername);
usersRouter.delete('/:id', JWTAuth, deleteUserById);
usersRouter.patch('/:id', JWTAuth, changeUserInfoById);

export default usersRouter;

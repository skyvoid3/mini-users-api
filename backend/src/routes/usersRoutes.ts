import { Router } from 'express';
import {
    getUserInfo,
    changeUserInfo,
    deleteUser,
    changeUserPassword,
    uploadUserAvatar,
} from '../controllers/usersController';
import { JWTAuth } from '../middleware/auth';
import Upload from '../middleware/upload';

const usersRouter = Router();

usersRouter.get('/me', JWTAuth, getUserInfo);
usersRouter.patch('/me', JWTAuth, changeUserInfo);
usersRouter.delete('/me', JWTAuth, deleteUser);
usersRouter.post(
    '/me/upload-avatar',
    JWTAuth,
    Upload.single('avatar'),
    uploadUserAvatar,
);
usersRouter.patch('/me/password', JWTAuth, changeUserPassword);

export default usersRouter;

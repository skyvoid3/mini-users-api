import { Router } from 'express';
import {
    createUser,
    loginUser,
    logoutUser,
    refreshLogin,
} from '../controllers/authController';
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: "Too many login attempts. Please Try Again Later" }
});

const authRouter = Router();

authRouter.post('/signup', createUser);
authRouter.post('/login', loginLimiter, loginUser);
authRouter.post('/refresh', refreshLogin);
authRouter.post('/logout', logoutUser);

export default authRouter;

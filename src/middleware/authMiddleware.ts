import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { User } from '../models/User';
import { Request, Response, NextFunction } from 'express';
import respond from '../helpers/response';
import { generateToken } from '../helpers/jwt';

interface AuthenticatedRequest extends Request {
  user?: any;
  newToken?: string | undefined;
}

const protect = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        token = req.headers.authorization.split(' ')[1];
        if (!token) {
          respond(res, 401, 'error', 'Not authorized, no token');
          return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
          id: string;
          iat: number;
          exp: number;
        };

        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
          respond(res, 404, 'error', 'User not found with this token');
          return;
        }

        const currentTime = Math.floor(Date.now() / 1000);
        const expirationTime = decoded.exp;
        const twoDaysInSeconds = 2 * 24 * 60 * 60;

        if (expirationTime - currentTime <= twoDaysInSeconds) {
          const newToken = generateToken(
            (user._id as unknown as string).toString()
          );
          // only if the token is about to expire in 2 days, send a new token
          req.newToken = newToken;
        } else {
          req.newToken = token;
        }

        req.user = user;
        next();
      } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
          respond(
            res,
            401,
            'error',
            'Not authorized, token expired. Login again'
          );
          return;
        } else {
          respond(res, 401, 'error', 'Not authorized, token failed');
          return;
        }
      }
    } else {
      respond(res, 401, 'error', 'Not authorized, no token');
      return;
    }
  }
);

export { protect };

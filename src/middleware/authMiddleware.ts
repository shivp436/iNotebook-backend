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

// Extract token from headers and verify it
const verifyToken = async (req: AuthenticatedRequest): Promise<any> => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
        iat: number;
        exp: number;
      };

      const user = await User.findById(decoded.id).select('-password');
      if (!user) return null;

      return { user, token, expirationTime: decoded.exp };
    } catch (error) {
      return null;
    }
  }
  return null;
};

const protect = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Verify the token and extract user info
    const tokenData = await verifyToken(req);

    if (!tokenData) {
      return respond(
        res,
        401,
        'error',
        'Not authorized, no token or token invalid'
      );
    }

    const { user, token, expirationTime } = tokenData;

    const currentTime = Math.floor(Date.now() / 1000);
    const twoDaysInSeconds = 2 * 24 * 60 * 60;

    // Check if the token is expiring soon and generate a new one if needed
    if (expirationTime - currentTime <= twoDaysInSeconds) {
      const newToken = generateToken(
        (user._id as unknown as string).toString()
      );
      req.newToken = newToken; // Send new token in the response if needed
    } else {
      req.newToken = token; // If token is still valid, keep the current one
    }

    req.user = user;
    next();
  }
);

export { protect, verifyToken };

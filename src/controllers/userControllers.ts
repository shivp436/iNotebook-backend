import { User, IUser } from '../models/User';
import { Request, Response } from 'express';
import { validateEmail, validateImageURL, validateName, validatePassword, validateUserName } from '../helpers/validators';
import bcrypt from 'bcryptjs';
import respond from '../helpers/response';

// User Model
// interface IUser {
//   name: string;
//   userName: string;
//   email: string;
//   password: string;
//   avatar: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// access: public
// method: POST
// route: /api/users/register
// description: Register a new user
const registerUser = async (req: Request, res: Response) : Promise<void> => {
  try {
    const { name, userName, email, password, password2, avatar } = req.body;
    
    // validate user inputs
    if (!name || !userName || !email || !password || !password2) {
      respond(res, 400, 'error', 'All fields are required');
      return;
    }

    if (!validateName(name)) {
      respond(res, 400, 'error', 'Invalid name');
      return;
    }

    if (!validateUserName(userName)) {
      respond(res, 400, 'error', 'Invalid username');
      return;
    }

    if (!validateEmail(email)) {
      respond(res, 400, 'error', 'Invalid email');
      return;
    }

    if (!validatePassword(password)) {
      respond(res, 400, 'error', 'Invalid password');
      return;
    }

    if (password !== password2) {
      respond(res, 400, 'error', 'Passwords do not match');
      return;
    }

    if (avatar && !validateImageURL(avatar)) {
      respond(res, 400, 'error', 'Invalid avatar URL');
      return;
    }

    // check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { userName }] });
    if (userExists) {
      respond(res, 400, 'error', 'User already exists');
      return;
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    const newUser: IUser = new User({
      name,
      userName,
      email,
      password: hashedPassword,
      avatar: avatar || 'https://www.gravatar.com/avatar/?d=mp',
    });

    // save user to database
    const user = await User.create(newUser);

    if (!user) {
      respond(res, 500, 'error', 'Failed to create user');
      return;
    }

    respond(res, 201, 'success', 'User created successfully', {
      _user : {
        _id : user._id,
        name : user.name,
        userName : user.userName,
        email : user.email,
        avatar : user.avatar,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      respond(res, 500, 'error', error.message);
      return;
    }
    respond(res, 500, 'error', 'Internal server error');
  }
}

const loginUser = async (req: Request, res: Response) : Promise<void> => {
}

export { registerUser, loginUser };
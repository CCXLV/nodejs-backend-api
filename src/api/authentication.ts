import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { Request, Response, NextFunction } from 'express';

import { AuthenticatedRequest } from '../utils/interfaces';

import { User } from '../models';


function generateAccessToken(user: User) {
    return jwt.sign(
        { id: user.id, email: user.email }, 
        process.env.ACCESS_TOKEN_SECRET as string, 
        { expiresIn: '2h' }
    );
}

function generateRefreshToken(user: User): string {
    return jwt.sign(
        { id: user.id, email: user.email }, 
        process.env.REFRESH_TOKEN_SECRET as string, 
        { expiresIn: '1d' }
    );
}

class Authentication {
    static async authorization(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;
        
        try {
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(400).send('Invalid email or password');
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                const accessToken = generateAccessToken(user);
                const refreshToken = generateRefreshToken(user);

                res.send({
                    access_token: accessToken,
                    refresh_token: refreshToken
                });
            } else {
                res.status(401).send('Invalid email or password');
            }
        } catch (err) {
            res.status(500).send('Internal Server Error');
        }
    }

    static async registration(req: Request, res: Response, next: NextFunction) {
        const { username, email, password } = req.body;
        
        try {
            await User.create({ username: username, email: email, password: password });

            res.send('User was successfully registered');
        } catch (err) {
            res.status(500).send('Internal Server Error');
        }
    }

    static async refreshAccessToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            if (req.currentUser) {
                const accessToken = generateAccessToken(req.currentUser);

                res.send({ access_token: accessToken });
            } else {
                res.status(401).send('Unauthorized');
            }
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }

    static async userAuthorization(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        if (req.currentUser) {
            const userData = await User.getUserData(req.currentUser.id);
            res.send(userData);
        }
    }
}

export default Authentication;
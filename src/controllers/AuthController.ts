import * as passport from 'passport';
import * as basic from 'passport-http';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as jwt from 'jwt-simple';
import * as moment from 'moment';
import Models from '../models';
import { UserInstance } from '../models/user';
import { Request, Response, NextFunction } from 'express';

const BasicStrategy = basic.BasicStrategy;

class AuthController {
    constructor() {
        this.userBasicStrategy();
        this.JWTStrategy();
    }

    private userBasicStrategy(): void {
        passport.use(
            new BasicStrategy(function(username, password, callback) {
                Models.User.find({
                    where: {
                        $or: [{ userName: username }, { email: username }]
                    }
                })
                    .then((user: UserInstance) => {
                        if (!user) {
                            return callback(null, false);
                        }

                        user.verifyPassword(password, function(err, isMatch) {
                            if (err) {
                                return callback(err);
                            }

                            if (!isMatch) {
                                return callback(null, false);
                            }

                            return callback(null, user);
                        });
                    })
                    .catch((err: Error) => {
                        return callback(err);
                    });
            })
        );
    }

    private JWTStrategy(): void {
        const params = {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeader(),
            passReqToCallback: true
        };
        passport.use(
            'jwt',
            new Strategy(params, (req: any, payload: any, callback: any) => {
                Models.User.find({ where: { userName: payload.username } })
                    .then((user: UserInstance) => {
                        if (!user) {
                            return callback(null, false, {
                                message: 'The user in the token was not found'
                            });
                        }

                        return callback(null, JSON.stringify(user));
                    })
                    .catch((err: Error) => {
                        return callback(err);
                    });
            })
        );
    }

    public isAuthenticated = passport.authenticate(['basic', 'jwt'], {
        session: false
    });

    public login(req: Request, res: Response, next: NextFunction): void {
        Models.User.find({
            where: {
                $or: [
                    { email: req.body.email },
                    { userName: req.body.userName }
                ]
            }
        })
            .then((user: UserInstance) => {
                if (!user) {
                    return res.status(401).json({
                        message: `User doesn't exist`
                    });
                }

                user.verifyPassword(req.body.password, function(err, isMatch) {
                    if (err) {
                        return res.status(500).json({
                            message: `Error trying to verify password ${err}`
                        });
                    }

                    if (!isMatch) {
                        return res.status(401).json({
                            message: `Invalid credentials, password doesn't match`
                        });
                    }

                    return res.status(200).json({
                        message: 'OK',
                        data: user.generateToken()
                    });
                });
            })
            .catch((err: Error) => {
                res
                    .status(500)
                    .json({ message: `Error trying to find the user ${err}` });
            });
    }
}

export default new AuthController();

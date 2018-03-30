import { Request, Response, NextFunction } from 'express';
import { UserInstance } from './../models/user';
import Models from './../models';

class UserController {
    constructor() {}

    public index(req: Request, res: Response, next: NextFunction): void {
        Models.User.findAll({ where: { active: true } })
            .then((result: UserInstance) => {
                res.status(200).json({
                    message: 'OK',
                    data: result
                });
            })
            .catch((err: Error) =>
                res.status(500).json({
                    message: `Error trying to access all users: ${err}`
                })
            );
    }

    public create(req: Request, res: Response, next: NextFunction): void {
        let user: UserInstance = req.body;
        Models.User.create(user)
            .then((result: UserInstance) => {
                res.status(200).json({
                    message: 'Created',
                    data: result,
                    tokenData: result.generateToken()
                });
            })
            .catch((err: Error) =>
                res.status(500).json({
                    message: `Error trying to create the user: ${err}`
                })
            );
    }

    public view(req: Request, res: Response, next: NextFunction): void {
        Models.User.findById(req.params.userId)
            .then((result: UserInstance) => {
                if (!result) {
                    return res
                        .status(400)
                        .json({ message: `User doesn't exist` });
                }

                res.status(200).json({
                    message: 'OK',
                    data: result
                });
            })
            .catch((err: Error) => {
                return res.status(500).json({
                    message: `Error trying to get the user: ${err}`
                });
            });
    }

    public update(req: Request, res: Response, next: NextFunction): void {
        Models.User.findById(req.params.userId)
            .then((result: UserInstance) => {
                if (!result) {
                    return res
                        .status(400)
                        .json({ message: `User doesn't exist` });
                }

                if (!result.active) {
                    return res
                        .status(400)
                        .json({ message: `User isn't activated` });
                }

                result
                    .update({
                        firstName: req.body.firstName || result.firstName,
                        lastName: req.body.lastName || result.lastName,
                        userName: req.body.userName || result.userName,
                        password: req.body.password || result.password,
                        profilePicture:
                            req.body.profilePicture || result.profilePicture,
                        active: req.body.active || result.active
                    })
                    .then(() => {
                        res.status(200).json({
                            message: 'OK',
                            data: result
                        });
                    })
                    .catch((err: Error) => {
                        res.status(500).json({
                            message: `Error trying to update the user ${err}`
                        });
                    });
            })
            .catch((err: Error) => {
                res.status(500).json({
                    message: `Error trying to access the user ${err}`
                });
            });
    }

    public delete(req: Request, res: Response, next: NextFunction): void {
        Models.User.findById(req.params.userId)
            .then((result: UserInstance) => {
                if (!result) {
                    return res
                        .status(400)
                        .json({ message: `User doesn't exist` });
                }

                result
                    .update({ active: false })
                    .then(() => {
                        res.status(200).json({
                            message: 'OK',
                            data: result
                        });
                    })
                    .catch((err: Error) => {
                        res.status(500).json({
                            message: `Error trying to deactivate the user ${err}`
                        });
                    });
            })
            .catch((err: Error) => {
                res.status(500).json({
                    message: `Error trying to access the user ${err}`
                });
            });
    }
}

export default new UserController();

import { Application, Router } from 'express';
import UserController from './controllers/UserController';
import AuthController from './controllers/AuthController';

class Routes {
    constructor(app: Application) {
        this.getRoutes(app);
    }

    private getRoutes(app: Application): void {
        // Users routes
        app
            .route('/api/users')
            .get(AuthController.isAuthenticated, UserController.index);
        app
            .route('/api/users/:userId')
            .get(AuthController.isAuthenticated, UserController.view)
            .put(AuthController.isAuthenticated, UserController.update)
            .delete(AuthController.isAuthenticated, UserController.delete);

        // Login and register routes
        app.route('/api/register').post(UserController.create);
        app.route('/api/login').post(AuthController.login);
    }
}

export default Routes;

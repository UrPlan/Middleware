import { QueryInterface, SequelizeStatic } from 'sequelize';

export = {
    up: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
        return queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },

            firstName: {
                type: Sequelize.STRING
            },

            lastName: {
                type: Sequelize.STRING
            },

            userName: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },

            email: {
                type: Sequelize.STRING,
                unique: true
            },

            password: {
                type: Sequelize.STRING,
                allowNull: false
            },

            profilePicture: {
                type: Sequelize.STRING
            },

            active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },

            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },

            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },

    down: (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
        return queryInterface.dropTable('Users');
    }
};

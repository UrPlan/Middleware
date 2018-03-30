import * as Sequelize from 'sequelize';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import * as jwt from 'jwt-simple';

interface Model {
    property: string;
}

export interface UserAttributes {
    firstName?: string;
    lastName?: string;
    userName?: string;
    email?: string;
    password?: string;
    profilePicture?: string;
    active?: boolean;
}

export interface UserInstance extends Sequelize.Instance<UserAttributes> {
    id: number;
    createdAt: Date;
    updatedAt: Date;

    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    profilePicture: string;
    active: boolean;

    // Instance Methods
    verifyPassword: (
        password: string,
        callback?: (err: Error, same?: boolean) => void
    ) => void;
    generateToken: () => Object;
}

function encryptPasswordIfChanged(user: UserInstance, options: any): void {
    user.set('password', bcrypt.hashSync(user.password, 10));
}

export default function defineUser(
    sequelize: Sequelize.Sequelize,
    DataTypes: Sequelize.DataTypes
): any {
    let User = sequelize.define('User', {
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        userName: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        profilePicture: DataTypes.STRING,
        active: DataTypes.BOOLEAN
    });

    User.associate = function(models) {
        // associations can be defined here
    };

    User.beforeCreate(encryptPasswordIfChanged);
    User.beforeUpdate(encryptPasswordIfChanged);

    let user: any = User;
    let userAddMethod: any = user.prototype;

    userAddMethod.verifyPassword = function(
        password: string,
        callback?: (err: Error, same?: boolean) => void
    ): void {
        bcrypt.compare(password, this.password, function(err, isMatch) {
            if (err) {
                return callback(err);
            }
            callback(null, isMatch);
        });
    };

    userAddMethod.generateToken = function(): Object {
        let expires = moment()
            .utc()
            .add({ days: 7 })
            .unix();
        let token = jwt.encode(
            {
                exp: expires,
                username: this.userName
            },
            process.env.JWT_SECRET
        );

        return {
            token: 'JWT ' + token,
            expires: moment.unix(expires).format(),
            user: this.id
        };
    };

    return User;
}

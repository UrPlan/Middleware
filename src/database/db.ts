import * as ORM from 'sequelize';
import { Sequelize, LoggingOptions } from 'sequelize';

export namespace Database {
    export class PSQL {
        public sequelize: Sequelize;
        private dbUrl: string;
        private options: LoggingOptions;
        private static _instance: PSQL;

        private constructor() {
            this.dbUrl = process.env.DB_URL;
            console.log(process.env.DB_URL);
            this.options = {
                benchmark: true,
                logging: console.log
            };
            this.sequelize = new ORM(this.dbUrl, this.options);

            this.sequelize
                .authenticate()
                .then(() => {
                    console.log(
                        'Connection has been established successfully.'
                    );
                })
                .catch(err => {
                    console.error('Unable to connect to the database:', err);
                });
        }

        public static get Instance() {
            return this._instance || (this._instance = new this());
        }
    }

    export const sequelize = PSQL.Instance.sequelize;
}

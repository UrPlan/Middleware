var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var basename = path.basename(__filename);
var env = process.env.NODE_ENV || "development";
var config = require(path.join(__dirname, "../database/config.js"))[env];
var models: any = {};

if (config.use_env_variable) {
	var sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
	var sequelize = new Sequelize(
		config.database,
		config.username,
		config.password,
		config
	);
}

fs
	.readdirSync(__dirname)
	.filter((file: any) => {
		return (
			file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
		);
	})
	.forEach((file: any) => {
		var model = sequelize["import"](path.join(__dirname, file));
		models[model.name] = model;
	});

Object.keys(models).forEach(modelName => {
	if (models[modelName].associate) {
		models[modelName].associate(models);
	}
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
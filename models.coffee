Sequelize = require("sequelize")

sequelize = new Sequelize "./db.sys", "", "", { dialect: "sqlite" }

exports.Admin = sequelize.define "Admin", {
	name: Sequelize.STRING,
	pwd: Sequelize.STRING,
	add_time: Sequelize.INTEGER
}, {
	tableName: "admin"
}

var Sequelize = require("sequelize");

var sequelize = new Sequelize(
	"ozgweb", 
	null, 
	null, 
	{ 
		dialect: "sqlite",
		storage: "./db.sys"
	}
);

//定义部分

exports.Admin = sequelize.define(
	"Admin",
	{
		name: Sequelize.STRING,
		pwd: Sequelize.STRING,
		add_time: Sequelize.INTEGER
	},
	{
		tableName: "t_admin",
		timestamps: false
	}
);

exports.ArtSingle = sequelize.define(
	"ArtSingle",
	{
		name: Sequelize.STRING,
		content: Sequelize.TEXT
	},
	{
		tableName: "t_art_single",
		timestamps: false
	}
);

exports.DataCat = sequelize.define(
	"DataCat",
	{
		name: Sequelize.STRING,
		sort: Sequelize.INTEGER,
		type: Sequelize.INTEGER
	},
	{
		tableName: "t_data_cat",
		timestamps: false
	}
);

exports.Data = sequelize.define(
	"Data",
	{
		name: Sequelize.STRING,
		content: Sequelize.TEXT,
		add_time: Sequelize.INTEGER,
		data_cat_id: Sequelize.INTEGER,
		sort: Sequelize.INTEGER,
		type: Sequelize.INTEGER,
		hits: Sequelize.INTEGER,
		picture: Sequelize.STRING
	},
	{
		tableName: "t_data",
		timestamps: false
	}
);

//关联部分
this.DataCat.hasMany(this.Data, {
	foreignKey: "data_cat_id"
});
this.Data.belongsTo(this.DataCat, {
	foreignKey: "data_cat_id"
});

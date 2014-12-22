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

exports.Admin = sequelize.define(
	"Admin",
	{
		name: Sequelize.STRING,
		pwd: Sequelize.STRING,
		add_time: Sequelize.INTEGER
	},
	{
		tableName: "simple_admin",
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
		tableName: "simple_artsingle",
		timestamps: false
	}
);

exports.DataClass = sequelize.define(
	"DataClass",
	{
		name: Sequelize.STRING,
		parent_id: Sequelize.INTEGER,
		sort: Sequelize.INTEGER,
		type: Sequelize.INTEGER
	},
	{
		tableName: "simple_dataclass",
		timestamps: false
	}
);

exports.Data = sequelize.define(
	"Data",
	{
		name: Sequelize.STRING,
		content: Sequelize.TEXT,
		add_time: Sequelize.INTEGER,
		dataclass_id: Sequelize.INTEGER,
		sort: Sequelize.INTEGER,
		type: Sequelize.INTEGER,
		hits: Sequelize.INTEGER,
		picture: Sequelize.STRING
	},
	{
		tableName: "simple_dataclass",
		timestamps: false
	}
);

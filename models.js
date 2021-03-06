﻿import Sequelize from "sequelize";

let sequelize = new Sequelize(
	"ozgweb", 
	null, 
	null, 
	{ 
		dialect: "sqlite",
		storage: "./db.sys"
	}
);

//定义部分

const Admin = sequelize.define(
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

const ArtSingle = sequelize.define(
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

const DataCat = sequelize.define(
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

const Data = sequelize.define(
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
DataCat.hasMany(Data, {
	foreignKey: "data_cat_id"
});
Data.belongsTo(DataCat, {
	foreignKey: "data_cat_id"
});

export default {
	Admin,
	ArtSingle,
	DataCat,
	Data,
};

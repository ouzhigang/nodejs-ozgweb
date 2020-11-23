const WEB_NAME = "nodejs-ozgweb";
const DB_PATH = "./db.sys"; //数据库
const SERVER_PORT = 8000; //监听端口
const PAGE_SIZE = 16;

const ADMIN_MENU_LIST = [
	{
		id: 1,
		name: "后台管理",
		selected: true,
		child_menu: [
			{
				id: 2,
				name: "数据管理",
				child_menu: [
					{
						id: 5,
						name: "分类列表",
						url: "data_cat_list.html",
						param: "type:1", //demo type:1,id:2
					},
					{
						id: 6,
						name: "数据列表",
						url: "data_list.html",
						param: "type:1",
					},
				]
			},
			{
				id: 3,
				name: "区域管理",
				child_menu: [
					{
						id: 7,
						name: "区域管理1",
						url: "art_single.html",
						param: "id:1",
					},
				]
			},
			{
				id: 4,
				name: "管理员管理",
				child_menu: [
					{
						id: 8,
						name: "修改密码",
						url: "admin_pwd.html",
					},
					{
						id: 9,
						name: "管理员列表",
						url: "admin_list.html",
					},
				]
			},
		]
	},

];

export default {
	WEB_NAME,
	DB_PATH,
	SERVER_PORT,
	PAGE_SIZE,
	ADMIN_MENU_LIST,
};
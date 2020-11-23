
import cfg from "../cfg";
import commons from "../commons";
import models from "../models";
import os from "os";
import process from "process";

let tmpIndex = 0; //临时使用的索引

const actionIndex = (req, res) => {
	commons.renderTemplate(res, "admin/index.html");
};

const actionAdmin = (req, res) => {
	//需要登录才可以访问
	if(!req.session.sess_admin) {
		res.redirect("index");
	}
	else {
		
		let server = commons.getRunEnv();
		if(server == "coffee") {
			server += ":???";
		}
		else {
			server += ":" + process.versions.node;
		}

		let res_data = {
			sys_type: os.type(),
			sys_ver: os.release(),
			server: server,
			sess_admin: req.session.sess_admin
		};
		
		commons.renderTemplate(res, "admin/admin.html", res_data);
	}	
};

const ajaxLogin = async (req, res) => {
		
	let name = req.query.name;
	let pwd = req.query.pwd;
	
	if(!name || name == "") {
		commons.resFail(res, 1, "用户名不能为空");
		return;
	}
	if(!pwd || pwd == "") {
		commons.resFail(res, 1, "密码不能为空");
		return;
	}
	
	let data = await models.Admin.findOne({
		where: {
			name: req.query.name,
			pwd: req.query.pwd
		}
	});
	
	if(data) {
		req.session.sess_admin = {
			name: data.name,
			pwd: data.pwd,
			add_time: data.add_time
		};
		commons.resSuccess(res, "登录成功");
	}
	else {
		commons.resFail(res, 1, "用户名或密码错误");
	}

};

const ajaxLogout = (req, res) => {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	else {
		req.session.sess_admin = null;
		commons.resSuccess(res, "退出成功");
	}
};

const ajaxMenuList = (req, res) => {
	//需要登录才可以访问
	if(!req.session.sess_admin)	{
		commons.resFail(res, 1, "需要登录才可以访问");
	}
	else {
		commons.resSuccess(res, "请求成功", cfg.ADMIN_MENU_LIST);
	}
};

const ajaxAdminList = async (req, res) => {
	//需要登录才可以访问
	if(!req.session.sess_admin)	{
		commons.resFail(res, 1, "需要登录才可以访问");
	}
	else {
		//分页索引和每页显示数
		let page = 1;
		if(req.query.page) {
			page = parseInt(req.query.page);
		}
		let page_size = cfg.PAGE_SIZE;
		if(req.query.page_size) {
			page_size = parseInt(req.query.page_size);
		}
		let total = await models.Admin.count();
		
		let page_count = commons.pageCount(total, page_size);
		let offset = parseInt((page - 1) * page_size);

		let data = await models.Admin.findAll({
			offset: offset,
			limit: page_size,
			order: [
				[ "id", "desc" ]
			]
		});

		for(let i in data) {						
			let dt = new Date(parseInt(data[i].add_time) * 1000);						
			data[i].add_time = commons.dateFormat(dt, "yyyy-MM-dd hh:mm:ss");
		}
		
		let res_data = {
			page: page,
			page_size: page_size,
			page_count: page_count,
			total: total,
			list: data
		};
		commons.resSuccess(res, "请求成功", res_data);
	}
};

const ajaxAdminAdd = async (req, res) => {
	//需要登录才可以访问
	if(!req.session.sess_admin)	{
		commons.resFail(res, 1, "需要登录才可以访问");
	}
	else {
		
		let name = req.query.name;
		let pwd = req.query.pwd;
		let pwd2 = req.query.pwd2;
		
		if(!name || name == "") {
			commons.resFail(res, 1, "用户名不能为空");
			return;
		}
		if(!pwd || pwd == "") {
			commons.resFail(res, 1, "密码不能为空");
			return;
		}
		if(pwd != pwd2) {
			commons.resFail(res, 1, "确认密码不正确");
			return;
		}
		
		let total = await models.Admin.count({
			where: {
				name: name
			}
		});
		
		if(total > 0) {
			commons.resFail(res, 1, "该管理员已存在");
		}
		else {
			
			let admin = {
				name: name,
				pwd: pwd,
				add_time: parseInt((new Date()).getTime() / 1000),
			};
			
			let data = await models.Admin.create(admin);
			commons.resSuccess(res, "添加成功", admin);
		}
	}
};

const ajaxAdminDel = async (req, res) => {
	//需要登录才可以访问
	if(!req.session.sess_admin)	{
		commons.resFail(res, 1, "需要登录才可以访问");
	}
	else {		
		let id = parseInt(req.query.id);
		let msg = await models.Admin.destroy({
			where: {
				id: id			
			}
		});
		commons.resSuccess(res, "删除成功");
	}
};

const ajaxAdminUpdatePwd = async (req, res) => {
	//需要登录才可以访问
	if(!req.session.sess_admin)	{
		commons.resFail(res, 1, "需要登录才可以访问");
	}
	else {
		let old_pwd = req.query.old_pwd;
		let pwd = req.query.pwd;
		let pwd2 = req.query.pwd2;
		
		if(!req.query.old_pwd || old_pwd == "") {
			commons.resFail(res, 1, "旧密码不能为空");
			return;
		}
		if(!req.query.pwd || pwd == "") {
			commons.resFail(res, 1, "新密码不能为空");
			return;
		}
		if(pwd != pwd2) {
			commons.resFail(res, 1, "确认密码不正确");
			return;
		}
		
		let total = await models.Admin.count({
			where: {
				name: req.session.sess_admin.name,
				pwd: old_pwd
			}
		});
		if(total == 0) {
			commons.resFail(res, 1, "旧密码不正确");
		}
		else {
			let data = await models.Admin.update(
				{
					pwd: pwd
				},
				{
					where: {
						name: req.session.sess_admin.name
					}
				}
			);
			commons.resSuccess(res, "修改密码成功");
		}
	}
};

const ajaxArtSingleGet = async (req, res) => {
	//需要登录才可以访问
	if(!req.session.sess_admin)	{
		commons.resFail(res, 1, "需要登录才可以访问");
	}
	else {
		let id = parseInt(req.query.id);
		
		let data = await models.ArtSingle.findOne({
			where: {
				id: id
			}
		});
		commons.resSuccess(res, "请求成功", data);
	}
};

const ajaxArtSingleUpdate = async (req, res) => {
	//需要登录才可以访问
	if(!req.session.sess_admin)	{
		commons.resFail(res, 1, "需要登录才可以访问");
	}
	else {
		console.log(req.body);
			
		let id = parseInt(req.body.id);
		let content = req.body.content;
		let data = await models.ArtSingle.update(
			{
				content: content
			},
			{
				where: {
					id: id
				}
			}
		);
		commons.resSuccess(res, "更新成功");
	}
};

const ajaxDataCatList = async (req, res) => {
	//需要登录才可以访问
	if(!req.session.sess_admin)	{
		commons.resFail(res, 1, "需要登录才可以访问");
	}
	else {
		
		let type = 1;
		if(req.query.type) {
			type = parseInt(req.query.type);
		}
		
		let data = await models.DataCat.findAll({
			where: {
				type: type
			},
			order: [
				[ "sort", "desc" ],
				[ "id", "desc" ]
			]
		});
		commons.resSuccess(res, "请求成功", data);
	}
};

const ajaxDataCatGet = async (req, res) => {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	else {
		let id = parseInt(req.query.id);

		let data = await models.DataCat.findOne({
			where: {
				id: id
			}
		});
		commons.resSuccess(res, "请求成功", data);
	}
};

const ajaxDataCatAdd = async (req, res) => {
	//需要登录才可以访问
	if(!req.session.sess_admin)	{
		commons.resFail(res, 1, "需要登录才可以访问");
	}
	else {
		let id = 0;
		if(req.query.id) {
			id = parseInt(req.query.id);
		}
		let name = req.query.name;
				
		if(id != 0) {
			//更新
			
			let data = await models.DataCat.update(
				{
					name: name,
					sort: parseInt(req.query.sort),
					type: parseInt(req.query.type)
				},
				{
					where: {
						id: id
					}
				}
			);
			commons.resSuccess(res, "更新成功");
		}
		else {
			//添加
			let data = await models.DataCat.create({
				name: name,
				sort: parseInt(req.query.sort),
				type: parseInt(req.query.type)
			});
			commons.resSuccess(res, "添加成功");
		}
		
	}
};

const ajaxDataCatDel = async (req, res) => {
	//需要登录才可以访问
	if(!req.session.sess_admin)	{
		commons.resFail(res, 1, "需要登录才可以访问");
	}
	else {
		
		let id = parseInt(req.query.id);		
		
		//删除该分类下的数据
		let data = await models.Data.destroy({
			where: {
				data_cat_id: id
			}
		});
		//删除分类
		data = await models.DataCat.destroy({
			where: {
				id: id
			}
		});
		commons.resSuccess(res, "删除成功");
	}
};

//ajaxDataList用到的递归获取data表的数据
const data_list = async (data, total, page, page_size, page_count, res) => {
	
	let data_cat = await data[tmpIndex].getDataCat();

	data[tmpIndex].dataValues.data_cat = data_cat;
			
	let dt = new Date(parseInt(data[tmpIndex].add_time) * 1000);						
	data[tmpIndex].add_time = commons.dateFormat(dt, "yyyy-MM-dd hh:mm:ss");
	
	//最后一条数据
	if(tmpIndex + 1 >= data.length) {									
		let res_data = {
			page: page,
			page_size: page_size,
			page_count: page_count,
			total: total,
			list: data
		};
		commons.resSuccess(res, "请求成功", res_data);
		return;
	}
	
	tmpIndex++;
	data_list(data, total, page, page_size, page_count, res);
	
}

const ajaxDataList = async (req, res) => {
	//需要登录才可以访问
	if(!req.session.sess_admin)	{
		commons.resFail(res, 1, "需要登录才可以访问");
	}
	else {
		//分页索引和每页显示数
		let page = 1;
		if(req.query.page) {
			page = parseInt(req.query.page);
		}

		let page_size = cfg.PAGE_SIZE;
		if(req.query.page_size) {
			page_size = parseInt(req.query.page_size);
		}
		let type = 1;
		if(req.query.type) {
			type = parseInt(req.query.type);
		}

		let total = await models.Data.count({
			where: {
				type: type
			}
		});
		let page_count = commons.pageCount(total, page_size);
		let offset = parseInt((page - 1) * page_size);

		let data = await models.Data.findAll({
			where: {
				type: type
			},
			offset: offset,
			limit: page_size,
			order: [
				[ "sort", "desc" ],
				[ "id", "desc" ]
			]
		});
		if(data.length == 0) {
			let res_data = {
				page: page,
				page_size: page_size,
				page_count: page_count,
				total: total,
				list: []
			};
			commons.resSuccess(res, "请求成功", res_data);
			return;
		}
		
		tmpIndex = 0;
		data_list(data, total, page, page_size, page_count, res);
	}
};

const ajaxDataGet = async (req, res) => {
	//需要登录才可以访问
	if(!req.session.sess_admin)	{
		commons.resFail(res, 1, "需要登录才可以访问");
	}
	else {
		let id = parseInt(req.query.id);
		let data = await models.Data.findOne({
			where: {
				id: id
			}
		});
		if(!data) {
			commons.resFail(res, 1, "找不到数据");
			return;
		}
		
		let data_cat = await data.getDataCat();
		data.dataValues.data_cat = data_cat;
		commons.resSuccess(res, "请求成功", data);
	}
};

const ajaxDataAdd = async (req, res) => {
	//需要登录才可以访问
	if(!req.session.sess_admin)	{
		commons.resFail(res, 1, "需要登录才可以访问");
	}
	else {
		
		let id = 0;
		if(req.body.id) {
			id = parseInt(req.body.id);
		}

		let name = null;
		if(!req.body.name) {
			commons.resFail(res, 1, "名称不能为空");
			return;
		}			
		name = req.body.name;
		
		let content = null;
		if(!req.body.content) {
			commons.resFail(res, 1, "内容不能为空");
			return;
		}			
		content = req.body.content;		
		
		if(id != 0) {
			//更新
			
			let data = await models.Data.update(
				{
					name: name,
					content: content,
					data_cat_id: parseInt(req.body.data_cat_id),
					sort: parseInt(req.body.sort),
					type: parseInt(req.body.type),
					picture: ""
				},
				{
					where: {
						id: id
					}
				}
			);
			commons.resSuccess(res, "更新成功");
		}
		else {
			//添加
			let data = await models.Data.create({
				name: name,
				content: content,
				add_time: parseInt((new Date()).getTime() / 1000),
				data_cat_id: parseInt(req.body.data_cat_id),
				sort: parseInt(req.body.sort),
				type: parseInt(req.body.type),
				hits: 0,
				picture: ""
			});
			commons.resSuccess(res, "添加成功");
		}
		
	}
};

const ajaxDataDel = async (req, res) => {
	//需要登录才可以访问
	if(!req.session.sess_admin)	{
		commons.resFail(res, 1, "需要登录才可以访问");
	}
	else {
		let id = parseInt(req.query.id);
		let data = await models.Data.destroy({
			where: {
				id: id
			}
		});
		commons.resSuccess(res, "删除成功");
	}
};

export default {
	actionIndex,
	actionAdmin,
	ajaxLogin,
	ajaxLogout,
	ajaxMenuList,	
	ajaxAdminList,
	ajaxAdminAdd,
	ajaxAdminDel,
	ajaxAdminUpdatePwd,
	ajaxArtSingleGet,
	ajaxArtSingleUpdate,
	ajaxDataCatList,
	ajaxDataCatGet,
	ajaxDataCatAdd,
	ajaxDataCatDel,
	ajaxDataList,
	ajaxDataGet,
	ajaxDataAdd,
	ajaxDataDel,
};
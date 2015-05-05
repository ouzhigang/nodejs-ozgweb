
var cfg = require("../cfg");
var commons = require("../commons");
var models = require("../models");
var os = require("os");
var process = require("process");

var tmpIndex = 0; //临时使用的索引

exports.actionIndex = function(req, res) {
	commons.renderTemplate(res, "admin/index.html");
};

exports.actionAdmin = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)
		res.redirect("index");
	else {
		
		var server = commons.getRunEnv();
		if(server == "coffee")
			server += ":???";
		else
			server += ":" + process.versions.node;
		
		var res_data = {
			sys_type: os.type(),
			sys_ver: os.release(),
			server: server,
			sess_admin: req.session.sess_admin
		};
		
		commons.renderTemplate(res, "admin/admin.html", res_data);
	}	
};

exports.ajaxLogin = function(req, res) {
		
	var name = req.query.name;
	var pwd = req.query.pwd;
	
	if(!name || name == "") {
		commons.resFail(res, 1, "用户名不能为空");
		return;
	}
	if(!pwd || pwd == "") {
		commons.resFail(res, 1, "密码不能为空");
		return;
	}
	
	models.Admin.find({
		where: {
			name: req.query.name,
			pwd: req.query.pwd
		}
	}).then(function(data) {
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
	});
	
};

exports.ajaxLogout = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	else {
		req.session.sess_admin = null;
		commons.resSuccess(res, "退出成功");
	}
};

exports.ajaxMenuList = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	else {
		commons.resSuccess(res, "请求成功", cfg.ADMIN_MENU_LIST);
	}
};

exports.ajaxAdminList = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	else {
		//分页索引和每页显示数
		var page = 1;
		if(req.query.page)
			page = parseInt(req.query.page);
		
		var page_size = cfg.PAGE_SIZE;
		if(req.query.page_size)
			page_size = parseInt(req.query.page_size);
		
		models.Admin.count().then(function(total) {
			var page_count = commons.pageCount(total, page_size);
			var offset = parseInt((page - 1) * page_size);

			models.Admin.findAll({
				limit: offset + ", " + page_size,
				order: "id desc"
			}).then(function(data) {
				
				for(var i in data) {						
					var dt = new Date(parseInt(data[i].add_time) * 1000);						
					data[i].add_time = dt.format("yyyy-MM-dd hh:mm:ss");
				}
				
				var res_data = {
					page: page,
					page_size: page_size,
					page_count: page_count,
					total: total,
					list: data
				};
				commons.resSuccess(res, "请求成功", res_data);
			});
			
		});
		
	}
};

exports.ajaxAdminAdd = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	else {
		
		var name = req.query.name;
		var pwd = req.query.pwd;
		var pwd2 = req.query.pwd2;
		
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
		
		models.Admin.count({
			where: {
				name: name
			}
		}).then(function(total) {
			if(total > 0)
				commons.resFail(res, 1, "该管理员已存在");
			else {
				
				var admin = {
					name: name,
					pwd: pwd,
					add_time: parseInt((new Date()).getTime() / 1000)
				};
				
				models.Admin.create(admin).then(function(data) {
					commons.resSuccess(res, "添加成功", admin);
				});
				
			}
		});
		
	}
};

exports.ajaxAdminDel = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	else {		
		var id = parseInt(req.query.id);
		models.Admin.destroy({
			where: {
				id: id			
			}
		}).then(function(msg) {
			commons.resSuccess(res, "删除成功");
		});
				
	}
};

exports.ajaxAdminUpdatePwd = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	else {
		var old_pwd = req.query.old_pwd;
		var pwd = req.query.pwd;
		var pwd2 = req.query.pwd2;
		
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
		
		models.Admin.count({
			where: {
				name: req.session.sess_admin.name,
				pwd: old_pwd
			}
		}).then(function(total) {
			if(total == 0) {
				commons.resFail(res, 1, "旧密码不正确");
			}
			else {
				models.Admin.update(
					{
						pwd: pwd
					},
					{
						where: {
							name: req.session.sess_admin.name
						}
					}
				).then(function(data) {
					commons.resSuccess(res, "修改密码成功");	
				});
				
			}
		});
		
	}
};

exports.ajaxArtSingleGet = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	else {
		var id = parseInt(req.query.id);
		
		models.ArtSingle.find({
			where: {
				id: id
			}
		}).then(function(data) {
			commons.resSuccess(res, "请求成功", data);
		});
		
	}
};

exports.ajaxArtSingleUpdate = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	else {
		console.log(req.body);
			
		var id = parseInt(req.body.id);
		var content = req.body.content;
		models.ArtSingle.update(
			{
				content: content
			},
			{
				where: {
					id: id
				}
			}
		).then(function(data) {
			commons.resSuccess(res, "更新成功");
		});
		
	}
};

exports.ajaxDataClassList = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	else {
		
		var type = 1;
		if(req.query.type)
			type = parseInt(req.query.type);
		
		models.DataClass.findAll({
			where: {
				type: type
			},
			order: "sort desc, id desc"
		}).then(function(data) {
			commons.resSuccess(res, "请求成功", data);
		});
		
	}
};

exports.ajaxDataClassGet = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	else {
		var id = parseInt(req.query.id);

		models.DataClass.find({
			where: {
				id: id
			}
		}).then(function(data) {
			commons.resSuccess(res, "请求成功", data);
		});
		
	}
};

exports.ajaxDataClassAdd = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	else {
		var id = 0;
		if(req.query.id)
			id = parseInt(req.query.id);
		
		var name = req.query.name;
				
		if(id != 0) {
			//更新
			
			models.DataClass.update(
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
			).then(function(data) {
				commons.resSuccess(res, "更新成功");
			});
			
		}
		else {
			//添加
			models.DataClass.create({
				name: name,
				sort: parseInt(req.query.sort),
				type: parseInt(req.query.type)
			}).then(function(data) {
				commons.resSuccess(res, "添加成功");
			});
			
		}
		
	}
};

exports.ajaxDataClassDel = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	else {
		
		var id = parseInt(req.query.id);		
		
		//删除该分类下的数据
		models.Data.destroy({
			where: {
				dataclass_id: id
			}
		}).then(function(data) {
			//删除分类
			models.DataClass.destroy({
				where: {
					id: id
				}
			}).then(function(data) {
				commons.resSuccess(res, "删除成功");	
			});
			
		});
		
	}
};

//ajaxDataList用到的递归获取data表的数据
function data_list(data, total, page, page_size, page_count, res) {
	
	data[tmpIndex].getDataClass().then(function(dataclass) {
		data[tmpIndex].dataValues.dataclass = dataclass;
			
		var dt = new Date(parseInt(data[tmpIndex].add_time) * 1000);						
		data[tmpIndex].add_time = dt.format("yyyy-MM-dd hh:mm:ss");
		
		//最后一条数据
		if(tmpIndex + 1 >= data.length) {									
			var res_data = {
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
	});
	
}

exports.ajaxDataList = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	else {
		//分页索引和每页显示数
		var page = 1;
		if(req.query.page)
			page = parseInt(req.query.page);
		
		var page_size = cfg.PAGE_SIZE;
		if(req.query.page_size)
			page_size = parseInt(req.query.page_size);
				
		var type = 1;
		if(req.query.type)
			type = parseInt(req.query.type);
		
		models.Data.count({
			where: {
				type: type
			}
		}).then(function(total) {
			var page_count = commons.pageCount(total, page_size);
			var offset = parseInt((page - 1) * page_size);

			models.Data.findAll({
				where: {
					type: type
				},
				limit: offset + ", " + page_size,
				order: "sort desc, id desc"
			}).then(function(data) {
				if(data.length == 0) {
					var res_data = {
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
			});
			
		});
		
	}
};

exports.ajaxDataGet = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	else {
		var id = parseInt(req.query.id);
		models.Data.find({
			where: {
				id: id
			}
		}).then(function(data) {
			if(!data) {
				commons.resFail(res, 1, "找不到数据");
				return;
			}
			
			data.getDataClass().then(function(dataclass) {
				data.dataValues.dataclass = dataclass;
					commons.resSuccess(res, "请求成功", data);
			});
			
		});
		
	}
};

exports.ajaxDataAdd = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	else {
		
		var id = 0;
		if(req.body.id)
			id = parseInt(req.body.id);
		
		var name = null;
		if(!req.body.name) {
			commons.resFail(res, 1, "名称不能为空");
			return;
		}			
		name = req.body.name;
		
		var content = null;
		if(!req.body.content) {
			commons.resFail(res, 1, "内容不能为空");
			return;
		}			
		content = req.body.content;		
		
		if(id != 0) {
			//更新
			
			models.Data.update(
				{
					name: name,
					content: content,
					dataclass_id: parseInt(req.body.dataclass_id),
					sort: parseInt(req.body.sort),
					type: parseInt(req.body.type),
					picture: ""
				},
				{
					where: {
						id: id
					}
				}
			).then(function(data) {
				commons.resSuccess(res, "更新成功");
			});
			
		}
		else {
			//添加
			models.Data.create({
				name: name,
				content: content,
				add_time: parseInt((new Date()).getTime() / 1000),
				dataclass_id: parseInt(req.body.dataclass_id),
				sort: parseInt(req.body.sort),
				type: parseInt(req.body.type),
				hits: 0,
				picture: ""
			}).then(function(data) {
				commons.resSuccess(res, "添加成功");
			});
			
		}
		
	}
};

exports.ajaxDataDel = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	else {
		var id = parseInt(req.query.id);
		models.Data.destroy({
			where: {
				id: id
			}
		}).then(function(data) {
			commons.resSuccess(res, "删除成功");
		});
		
	}
};

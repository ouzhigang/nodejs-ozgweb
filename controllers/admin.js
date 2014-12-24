
var cfg = require("../cfg");
var commons = require("../commons");
var models = require("../models");
var os = require("os");
var async = require("async");

var tmpIndex = 0; //临时使用的索引

exports.index = function(req, res) {
	commons.renderTemplate(res, "admin/index.html");
};

exports.admin = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)
		res.redirect("index");
	else {
		var res_data = {
			sys_type: os.type(),
			sys_ver: os.release(),
			sys_platform: os.platform(),
			sess_admin: req.session.sess_admin
		};
		
		commons.renderTemplate(res, "admin/admin.html", res_data);
	}	
};

/*exports.getCode = function(req, res) {
	res.send("暂无验证码");
};*/

exports.ajaxLogin = function(req, res) {
		
	var name = req.query.name;
	var pwd = req.query.pwd;
	
	if(!name || name == "")
		commons.resFail(res, 1, "用户名不能为空");	
	if(!pwd || pwd == "")
		commons.resFail(res, 1, "密码不能为空");
	
	models.Admin.find({
		where: {
			name: req.query.name,
			pwd: req.query.pwd
		}
	}).on("success", function(data) {
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
	}).on("failure", function(err) {
		commons.resFail(res, 1, err);
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
		
		models.Admin.count().on("success", 
			function(total) {
				
				var page_count = commons.pageCount(total, page_size);
				var offset = parseInt((page - 1) * page_size);

				models.Admin.findAll({
					limit: offset + ", " + page_size,
					order: "id desc"
				}).on("success", function(data) {
					
					var res_data = {
						page: page,
						page_size: page_size,
						page_count: page_count,
						list: data
					};					
					commons.resSuccess(res, "请求成功", res_data);
					
				}).on("failure", function(err) {		
					commons.resFail(res, 1, err);
				});
				
			}
		).on("failure", function(err) {
			commons.resFail(res, 1, err);
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
		
		if(!name || name == "")
			commons.resFail(res, 1, "用户名不能为空");
		if(!pwd || pwd == "")
			commons.resFail(res, 1, "密码不能为空");
		if(pwd != pwd2)
			commons.resFail(res, 1, "确认密码不正确");
		
		models.Admin.count({
			where: {
				name: name
			}
		}).on("success", function(total) {
			if(total > 0)
				commons.resFail(res, 1, "该管理员已存在");
			else {
				
				var admin = {
					name: name,
					pwd: pwd,
					add_time: parseInt((new Date()).getTime() / 1000)
				};
				
				models.Admin.create(admin).on("success", function(data) {
					commons.resSuccess(res, "添加成功", admin);
				}).on("failure", function(err) {
					commons.resFail(res, 1, err);
				});
				
			}			
		}).on("failure", function(err) {		
			commons.resFail(res, 1, err);
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
			id: id
		}).on("success", function(msg) {
			commons.resSuccess(res, "删除成功");
		}).on("failure", function(err) {
			commons.resFail(res, 1, err);
		});
		
	}
};

exports.ajaxAdminUpdatePwd = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	else {
		var old_pwd = request.query.old_pwd;
		var pwd = request.query.pwd;
		var pwd2 = request.query.pwd2;
		
		if(old_pwd || old_pwd == "")
			commons.resFail(res, 1, "旧密码不能为空");
		if(pwd || pwd == "")
			commons.resFail(res, 1, "新密码不能为空");
		if(pwd != pwd2)
			commons.resFail(res, 1, "确认密码不正确");
		
		models.Admin.update(
			{
				pwd: pwd
			},
			{
				name: res.session.sess_admin.name,
				pwd: old_pwd
			}
		).on("success", function(data) {
			if(data)
				commons.resSuccess(res, "修改密码成功");
			else
				commons.resFail(res, 1, "旧密码不正确");
		}).on("failure", function(err) {
			commons.resFail(res, 1, err);
		});
		
	}
};

exports.ajaxArtSingleGet = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	else {
		var id = parseInt(request.query.id);
		
		models.ArtSingle.find({
			where: {
				id: id
			}
		}).on("success", function(data) {
			commons.resSuccess(res, "请求成功", data);
		}).on("failure", function(err) {
			commons.resFail(res, 1, err);
		});
		
	}
};

exports.ajaxArtSingleUpdate = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	else {
		var id = parseInt(request.body.id);
		var content = request.body.content;
		models.ArtSingle.update(
			{
				content: content
			},
			{
				id: id
			}
		).on("success", function(data) {
			commons.resSuccess(res, "更新成功");
		}).on("failure", function(err) {
			commons.resFail(res, 1, err);
		});
		
	}
};

exports.ajaxDataClassList = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	else {
		commons.resFail(res, 1, "正在完成中");
	}
};

exports.ajaxDataClassGet = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	else {
		var id = parseInt(request.query.id);
		commons.resFail(res, 1, "正在完成中");
	}
};

exports.ajaxDataClassAdd = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	else {
		var id = 0;
		if(request.query.id)
			id = parseInt(request.query.id);
		
		var name = request.query.name;
		var parent_id = parseInt(request.query.parent_id);
		
		var dataclass = null;
		
		if(id != 0) {
			//更新
			
			if(id == parent_id)
				commons.resFail(res, 1, "父级分类不能为当前选中分类");
			else {
				models.DataClass.update(
					{
						name: name,
						parent_id: parent_id,
						sort: parseInt(request.query.sort),
						type: parseInt(request.query.type)
					},
					{
						id: id
					}
				).on("success", function(data) {
					commons.resSuccess(res, "更新成功");
				}).on("failure", function(err) {
					commons.resFail(res, 1, err);
				});				
			}
			
		}
		else {
			//添加
			models.DataClass.create({
				name: name,
				parent_id: parent_id,
				sort: parseInt(request.query.sort),
				type: parseInt(request.query.type)
			}).on("success", function(data) {
				commons.resSuccess(res, "添加成功");
			}).on("failure", function(err) {
				commons.resFail(res, 1, err);
			});
		}
		
	}
};

exports.ajaxDataClassDel = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	else {		
		
		commons.resFail(res, 1, "正在完成中");
		
	}
};

//ajaxDataList用到的递归获取data表的数据
function data_list(data, total, page, page_size, page_count, res) {
	
	data[tmpIndex].getDataClass().on("success", 
		function(dataclass) {
			data[tmpIndex].dataValues.dataclass = dataclass;
						
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
		}
	);	
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
		}).on("success", 
			function(total) {
				var page_count = commons.pageCount(total, page_size);
				var offset = parseInt((page - 1) * page_size);

				models.Data.findAll({
					where: {
						type: type
					},
					limit: offset + ", " + page_size,
					order: "id desc"
				}).on("success", function(data) {
					
					tmpIndex = 0;
					data_list(data, total, page, page_size, page_count, res);
					
				}).on("failure", function(err) {		
					commons.resFail(res, 1, err);
				});
				
			}
		).on("failure", function(err) {
			commons.resFail(res, 1, err);
		});
		
	}
};

exports.ajaxDataGet = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	else {
		var id = parseInt(request.query.id);
		models.Data.find({
			where: {
				id: id
			}
		}).on("success", function(data) {
			commons.resSuccess(res, "请求成功", data);
		}).on("failure", function(err) {
			commons.resFail(res, 1, err);
		});
		
	}
};

exports.ajaxDataAdd = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	else {
		
		var id = 0;
		if(request.body.id)
			id = parseInt(request.body.id);
		
		var name = null;
		if(!request.body.name) {
			commons.resFail(res, 1, "名称不能为空");
			return;
		}			
		name = request.body.name;
		
		var content = null;
		if(!request.body.content) {
			commons.resFail(res, 1, "内容不能为空");
			return;
		}			
		content = request.body.content;
				
		var data = null;
		
		if(id != 0) {
			//更新
			
			if(id == parent_id)
				commons.resFail(res, 1, "父级分类不能为当前选中分类");
			else {
				models.Data.update(
					{
						name: name,
						content: content,
						dataclass_id: parseInt(request.body.dataclass_id),
						sort: parseInt(request.body.sort),
						type: parseInt(request.body.type),
						picture: ""
					},
					{
						id: id
					}
				).on("success", function(data) {
					commons.resSuccess(res, "更新成功");
				}).on("failure", function(err) {
					commons.resFail(res, 1, err);
				});				
			}
			
		}
		else {
			//添加
			models.Data.create({
				name: name,
				content: content,
				add_time: parseInt((new Date()).getTime() / 1000),
				dataclass_id: parseInt(request.body.dataclass_id),
				sort: parseInt(request.body.sort),
				type: parseInt(request.body.type),
				hits: 0,
				picture: ""
			}).on("success", function(data) {
				commons.resSuccess(res, "添加成功");
			}).on("failure", function(err) {
				commons.resFail(res, 1, err);
			});
		}
		
	}
};

exports.ajaxDataDel = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	else {
		var id = parseInt(request.query.id);
		models.Data.destroy({
			id: id
		}).on("success", function(data) {
			commons.resSuccess(res, "删除成功");
		}).on("failure", function(err) {
			commons.resFail(res, 1, err);
		});
	}
};

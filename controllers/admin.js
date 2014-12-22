
var cfg = require("../cfg");
var commons = require("../commons");
var models = require("../models");

exports.index = function(req, res) {
	commons.renderTemplate(res, "admin/index.html");
};

exports.admin = function(req, res) {
	commons.renderTemplate(res, "admin/admin.html");
};

/*exports.getCode = function(req, res) {
	res.send("暂无验证码");
};*/

exports.ajaxLogin = function(req, res) {
	
	/*
	//add
	models.Admin.create({
		name: "aaaa",
		pwd: "aaaa",
		add_time: parseInt((new Date()).getTime() / 1000)
	}).complete(function(err) {
		if (err) {
			console.log('失败', err);
		} 
		else {
			console.log('成功');
		}
	});*/
	
	//delete
	/*models.Admin.destroy({
		where: {
			id: 21
		}
	}).on("success", function(result) {
		console.log(result);
	}).on("failure", function(err) {
		console.log(err);
	});*/
	
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
	
	req.session.sess_admin = null;
	commons.resSuccess(res, "退出成功");
};

exports.ajaxMenuList = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	
	commons.resSuccess(res, "请求成功", cfg.ADMIN_MENU_LIST);
};

exports.ajaxAdminList = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	
	commons.resFail(res, 1, "正在完成中");
};

exports.ajaxAdminAdd = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	
	commons.resFail(res, 1, "正在完成中");
};

exports.ajaxAdminDel = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	
	commons.resFail(res, 1, "正在完成中");
};

exports.ajaxAdminUpdatePwd = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	
	commons.resFail(res, 1, "正在完成中");
};

exports.ajaxArtSingleGet = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	
	commons.resFail(res, 1, "正在完成中");
};

exports.ajaxArtSingleUpdate = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	
	commons.resFail(res, 1, "正在完成中");
};

exports.ajaxDataClassList = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	
	commons.resFail(res, 1, "正在完成中");
};

exports.ajaxDataClassGet = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	
	commons.resFail(res, 1, "正在完成中");
};

exports.ajaxDataClassAdd = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	
	commons.resFail(res, 1, "正在完成中");
};

exports.ajaxDataClassDel = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	
	commons.resFail(res, 1, "正在完成中");
};

exports.ajaxDataList = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	
	commons.resFail(res, 1, "正在完成中");
};

exports.ajaxDataGet = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	
	commons.resFail(res, 1, "正在完成中");
};

exports.ajaxDataAdd = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	
	commons.resFail(res, 1, "正在完成中");
};

exports.ajaxDataDel = function(req, res) {
	//需要登录才可以访问
	if(!req.session.sess_admin)	
		commons.resFail(res, 1, "需要登录才可以访问");
	
	commons.resFail(res, 1, "正在完成中");
};

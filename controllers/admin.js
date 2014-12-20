
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
	commons.resFail(res, 1, "正在完成中");
};

exports.ajaxLogout = function(req, res) {
	commons.resFail(res, 1, "正在完成中");
};

exports.ajaxMenuList = function(req, res) {
	commons.resFail(res, 1, "正在完成中");
};

exports.ajaxAdminList = function(req, res) {
	commons.resFail(res, 1, "正在完成中");
};

exports.ajaxAdminAdd = function(req, res) {
	commons.resFail(res, 1, "正在完成中");
};

exports.ajaxAdminDel = function(req, res) {
	commons.resFail(res, 1, "正在完成中");
};

exports.ajaxAdminUpdatePwd = function(req, res) {
	commons.resFail(res, 1, "正在完成中");
};

exports.ajaxArtSingleGet = function(req, res) {
	commons.resFail(res, 1, "正在完成中");
};

exports.ajaxArtSingleUpdate = function(req, res) {
	commons.resFail(res, 1, "正在完成中");
};

exports.ajaxDataClassList = function(req, res) {
	commons.resFail(res, 1, "正在完成中");
};

exports.ajaxDataClassGet = function(req, res) {
	commons.resFail(res, 1, "正在完成中");
};

exports.ajaxDataClassAdd = function(req, res) {
	commons.resFail(res, 1, "正在完成中");
};

exports.ajaxDataClassDel = function(req, res) {
	commons.resFail(res, 1, "正在完成中");
};

exports.ajaxDataList = function(req, res) {
	commons.resFail(res, 1, "正在完成中");
};

exports.ajaxDataGet = function(req, res) {
	commons.resFail(res, 1, "正在完成中");
};

exports.ajaxDataAdd = function(req, res) {
	commons.resFail(res, 1, "正在完成中");
};

exports.ajaxDataDel = function(req, res) {
	commons.resFail(res, 1, "正在完成中");
};


cfg = require "../cfg"
commons = require "../commons"

exports.index = (req, res) ->	
	commons.renderTemplate res, "admin/index.html"

exports.admin = (req, res) ->	
	commons.renderTemplate res, "admin/admin.html"

exports.getCode = (req, res) ->
	res.send "dsgdsh"

exports.ajaxLogin = (req, res) ->
	commons.resFail(1, "正在完成中")

exports.ajaxLogout = (req, res) ->
	commons.resFail(1, "正在完成中")

exports.ajaxMenuList = (req, res) ->
	commons.resFail(1, "正在完成中")

exports.ajaxAdminList = (req, res) ->
	commons.resFail(1, "正在完成中")
	
exports.ajaxAdminAdd = (req, res) ->
	commons.resFail(1, "正在完成中")
	
exports.ajaxAdminDel = (req, res) ->
	commons.resFail(1, "正在完成中")
	
exports.ajaxAdminUpdatePwd = (req, res) ->
	commons.resFail(1, "正在完成中")
	
exports.ajaxArtSingleGet = (req, res) ->
	commons.resFail(1, "正在完成中")
	
exports.ajaxArtSingleUpdate = (req, res) ->
	commons.resFail(1, "正在完成中")
	
exports.ajaxDataClassList = (req, res) ->
	commons.resFail(1, "正在完成中")
	
exports.ajaxDataClassGet = (req, res) ->
	commons.resFail(1, "正在完成中")
	
exports.ajaxDataClassAdd = (req, res) ->
	commons.resFail(1, "正在完成中")
	
exports.ajaxDataClassAdd = (req, res) ->
	commons.resFail(1, "正在完成中")
	
exports.ajaxDataClassDel = (req, res) ->
	commons.resFail(1, "正在完成中")
	
exports.ajaxDataList = (req, res) ->
	commons.resFail(1, "正在完成中")
	
exports.ajaxDataGet = (req, res) ->
	commons.resFail(1, "正在完成中")
	
exports.ajaxDataAdd = (req, res) ->
	commons.resFail(1, "正在完成中")
	
exports.ajaxDataDel = (req, res) ->
	commons.resFail(1, "正在完成中")


var admin = require("./controllers/admin");
var site = require("./controllers/site");

var app = null;

exports.startUrls = function(app) {
	this.app = app;
	app.get("/admin/index", admin.actionIndex);
	app.get("/admin/admin", admin.actionAdmin);
	app.get("/admin/ajax_login", admin.ajaxLogin);
	app.get("/admin/ajax_logout", admin.ajaxLogout);
	app.get("/admin/ajax_menu_list", admin.ajaxMenuList);
	app.get("/admin/ajax_admin_list", admin.ajaxAdminList);
	app.get("/admin/ajax_admin_add", admin.ajaxAdminAdd);
	app.get("/admin/ajax_admin_del", admin.ajaxAdminDel);
	app.get("/admin/ajax_admin_updatepwd", admin.ajaxAdminUpdatePwd);
	app.get("/admin/ajax_art_single_get", admin.ajaxArtSingleGet);
	app.post("/admin/ajax_art_single_update", admin.ajaxArtSingleUpdate);
	app.get("/admin/ajax_dataclass_list", admin.ajaxDataClassList);
	app.get("/admin/ajax_dataclass_get", admin.ajaxDataClassGet);
	app.get("/admin/ajax_dataclass_add", admin.ajaxDataClassAdd);
	app.get("/admin/ajax_dataclass_del", admin.ajaxDataClassDel);
	app.get("/admin/ajax_data_list", admin.ajaxDataList);
	app.get("/admin/ajax_data_get", admin.ajaxDataGet);
	app.post("/admin/ajax_data_add", admin.ajaxDataAdd);
	app.get("/admin/ajax_data_del", admin.ajaxDataDel);
	
};

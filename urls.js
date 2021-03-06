
import admin from "./controllers/admin";
//import site from "./controllers/site";

const startUrls = (app) => {
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
	app.get("/admin/ajax_data_cat_list", admin.ajaxDataCatList);
	app.get("/admin/ajax_data_cat_get", admin.ajaxDataCatGet);
	app.get("/admin/ajax_data_cat_add", admin.ajaxDataCatAdd);
	app.get("/admin/ajax_data_cat_del", admin.ajaxDataCatDel);
	app.get("/admin/ajax_data_list", admin.ajaxDataList);
	app.get("/admin/ajax_data_get", admin.ajaxDataGet);
	app.post("/admin/ajax_data_add", admin.ajaxDataAdd);
	app.get("/admin/ajax_data_del", admin.ajaxDataDel);
	
};

export default {
	startUrls,
};

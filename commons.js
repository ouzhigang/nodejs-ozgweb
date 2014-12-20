
cfg = require("./cfg");

//公用的render函数，主要加入一些公用变量
exports.renderTemplate = function(response, templates, res_data) {

	if(!res_data)
		res_data = null;

	var response_data = {
		cfg_webname: cfg.WEB_NAME,
		cfg_jquery: cfg.JQUERY,	
	};
	if(res_data != null)
		response_data.res_data = res_data;
	response.render(templates, response_data);
};

//仅在这个模块用到
exports.res = function(res, res_code, desc, data) {
	var res_data = {
		code: res_code,
		desc: desc
	};
	if(data)
		res_data.data = data;
	res.json(res_data);
};

//回应请求成功
exports.resSuccess = function(res, desc, data) {
	if(!data)
		data = null;

	this.res(res, 0, desc, data);
};

//回应请求失败
exports.resFail = function(res, res_code, desc, data) {
	if(!data)
		data = null;

	this.res(res, res_code, desc, data);
};

//计算总页数
exports.pageCount = function(count, page_size) {
	if(count % page_size == 0)
		return count / page_size;
	else
		return (count / page_size) + 1;
};

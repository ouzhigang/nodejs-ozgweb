
var cfg = require("./cfg");
var process = require("process");

Date.prototype.format = function(format) {
	
	var o = {
		"M+" : this.getMonth() + 1, //month
		"d+" : this.getDate(), //day
		"h+" : this.getHours(), //hour
		"m+" : this.getMinutes(), //minute
		"s+" : this.getSeconds(), //second
		"q+" : Math.floor((this.getMonth() + 3) / 3), //quarter
		"S" : this.getMilliseconds() //millisecond
	}
	
	if(/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	
	for(var k in o) {
		if(new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
} 

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
	res.end();
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
		return parseInt(count / page_size);
	else
		return parseInt((count / page_size) + 1);
};

//获取运行环境node,coffee,iojs
exports.getRunEnv = function() {
	
	var argv = process.argv;
	if(argv.length > 0)
		return argv[0];
	
	//默认为node
	return "node";
};

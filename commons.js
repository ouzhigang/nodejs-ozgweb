import cfg from "./cfg";
import process from "process";

const dateFormat = (dt, fmt) => {
	let o = {
		"M+" : dt.getMonth() + 1, //month
		"d+" : dt.getDate(), //day
		"h+" : dt.getHours(), //hour
		"m+" : dt.getMinutes(), //minute
		"s+" : dt.getSeconds(), //second
		"q+" : Math.floor((dt.getMonth() + 3) / 3), //quarter
		"S" : dt.getMilliseconds() //millisecond
	}
	
	if(/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (dt.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	
	for(let k in o) {
		if(new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return fmt;
};

//公用的render函数，主要加入一些公用变量
const renderTemplate = (response, templates, res_data) => {

	if(!res_data) {
		res_data = null;
	}
	
	let response_data = {
		cfg_webname: cfg.WEB_NAME,
	};
	if(res_data != null) {
		response_data.res_data = res_data;
	}
	response.render(templates, response_data);
};

//仅在这个模块用到
const res = (respond, res_code, desc, data) => {
	let res_data = {
		code: res_code,
		desc: desc
	};
	if(data) {
		res_data.data = data;
	}
	respond.json(res_data);
	respond.end();
};

//回应请求成功
const resSuccess = (respond, desc, data) => {
	if(!data) {
		data = null;
	}

	res(respond, 0, desc, data);
};

//回应请求失败
const resFail = (respond, res_code, desc, data) => {
	if(!data) {
		data = null;
	}

	res(respond, res_code, desc, data);
};

//计算总页数
const pageCount = (count, page_size) => {
	if(count % page_size == 0) {
		return parseInt(count / page_size);
	}
	else {
		return parseInt((count / page_size) + 1);
	}
};

//获取运行环境node,coffee,iojs
const getRunEnv = () => {
	
	let argv = process.argv;
	if(argv.length > 0) {
		return argv[0];
	}
	
	//默认为node
	return "node";
};

export default {
	dateFormat,
	renderTemplate,
	res,
	resSuccess,
	resFail,
	pageCount,
	getRunEnv,
};

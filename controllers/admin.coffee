
cfg = require "../cfg"
commons = require "../commons"
models = require "../models"
os = require "os"
ccap = require "ccap"
process = require "process"

tmpIndex = 0 #临时使用的索引

exports.index = (req, res) ->
	commons.renderTemplate res, "admin/index.html"

exports.admin = (req, res) ->
	#需要登录才可以访问
	if !req.session.sess_admin
		res.redirect "index"
	else
	
		server = commons.getRunEnv()
		if server == "coffee"
			server += ":???" #不知道怎么获取coffeescript的版本号
		else
			server += process.versions.node
	
		res_data = {
			sys_type: os.type(),
			sys_ver: os.release(),
			server: server,
			sess_admin: req.session.sess_admin
		}
		
		commons.renderTemplate res, "admin/admin.html", res_data	

exports.getCode = (req, res) ->
	captcha = ccap()
	ary = captcha.get()
	text = ary[0]
	buffer = ary[1]
	req.session.captcha_text = text
	res.set "Content-Type", "image/bmp"
	res.send buffer

exports.ajaxLogin = (req, res) ->
		
	name = req.query.name
	pwd = req.query.pwd
	code = req.query.code
	
	if !name || name == ""
		commons.resFail res, 1, "用户名不能为空"
		return
	if !pwd || pwd == ""
		commons.resFail res, 1, "密码不能为空"
		return
	if code.toLowerCase() != req.session.captcha_text.toLowerCase()
		commons.resFail res, 1, "验证码错误"
		return
	
	models.Admin.find({
		where: {
			name: req.query.name,
			pwd: req.query.pwd
		}
	}).on("success", (data) ->
		if data
			req.session.sess_admin = {
				name: data.name,
				pwd: data.pwd,
				add_time: data.add_time
			}
			commons.resSuccess res, "登录成功"
		
		else
			commons.resFail res, 1, "用户名或密码错误"
		
	).on("failure", (err) ->
		commons.resFail res, 1, err
	)

exports.ajaxLogout = (req, res) ->
	#需要登录才可以访问
	if !req.session.sess_admin	
		commons.resFail res, 1, "需要登录才可以访问"
	else
		req.session.sess_admin = null
		commons.resSuccess res, "退出成功"
	
exports.ajaxMenuList = (req, res) ->
	#需要登录才可以访问
	if !req.session.sess_admin
		commons.resFail res, 1, "需要登录才可以访问"
	else
		commons.resSuccess res, "请求成功", cfg.ADMIN_MENU_LIST
	
exports.ajaxAdminList = (req, res) ->
	#需要登录才可以访问
	if !req.session.sess_admin
		commons.resFail res, 1, "需要登录才可以访问"
	else
		#分页索引和每页显示数
		page = 1
		if req.query.page
			page = parseInt req.query.page
		
		page_size = cfg.PAGE_SIZE
		if req.query.page_size
			page_size = parseInt req.query.page_size
		
		models.Admin.count().on("success", 
			(total) ->
				
				page_count = commons.pageCount total, page_size
				offset = parseInt ((page - 1) * page_size)

				models.Admin.findAll({
					limit: offset + ", " + page_size,
					order: "id desc"
				}).on("success", (data) ->
					
					for i in data
						dt = new Date (parseInt i.add_time) * 1000						
						i.add_time = dt.format "yyyy-MM-dd hh:mm:ss"
										
					res_data = {
						page: page,
						page_size: page_size,
						page_count: page_count,
						total: total,
						list: data
					}
					commons.resSuccess res, "请求成功", res_data
					
				).on("failure", (err) ->		
					commons.resFail res, 1, err
				)
							
		).on("failure", (err) ->
			commons.resFail res, 1, err
		)	

exports.ajaxAdminAdd = (req, res) ->
	#需要登录才可以访问
	if !req.session.sess_admin
		commons.resFail res, 1, "需要登录才可以访问"
	else		
		name = req.query.name
		pwd = req.query.pwd
		pwd2 = req.query.pwd2
		
		if !name || name == ""
			commons.resFail res, 1, "用户名不能为空"
			return
		if !pwd || pwd == ""
			commons.resFail res, 1, "密码不能为空"
			return
		if pwd != pwd2
			commons.resFail res, 1, "确认密码不正确"
			return
		
		models.Admin.count({
			where: {
				name: name
			}
		}).on("success", (total) ->
			if total > 0
				commons.resFail res, 1, "该管理员已存在"
			else				
				admin = {
					name: name,
					pwd: pwd,
					add_time: parseInt ((new Date()).getTime() / 1000)
				}
				
				(models.Admin.create admin).on("success", (data) ->
					commons.resSuccess res, "添加成功", admin
				).on("failure", (err) ->
					commons.resFail res, 1, err
				)
				
		).on("failure", (err) ->
			commons.resFail res, 1, err
		)

exports.ajaxAdminDel = (req, res) ->
	#需要登录才可以访问
	if !req.session.sess_admin	
		commons.resFail res, 1, "需要登录才可以访问"
	else
		id = parseInt req.query.id
		models.Admin.destroy({
			where: {
				id: id			
			}
		}).on("success", (msg) ->
			commons.resSuccess res, "删除成功"
		).on("failure", (err) ->
			commons.resFail res, 1, err
		)

exports.ajaxAdminUpdatePwd = (req, res) ->
	#需要登录才可以访问
	if !req.session.sess_admin	
		commons.resFail res, 1, "需要登录才可以访问"
	else
		old_pwd = req.query.old_pwd
		pwd = req.query.pwd
		pwd2 = req.query.pwd2
		
		if !req.query.old_pwd || old_pwd == ""
			commons.resFail res, 1, "旧密码不能为空"
			return
		if !req.query.pwd || pwd == ""
			commons.resFail res, 1, "新密码不能为空"
			return
		if pwd != pwd2
			commons.resFail res, 1, "确认密码不正确"
			return
		
		models.Admin.count({
			where: {
				name: req.session.sess_admin.name,
				pwd: old_pwd
			}
		}).on("success", (total) ->
			
			if total == 0
				commons.resFail res, 1, "旧密码不正确"
			else
				models.Admin.update(
					{
						pwd: pwd
					},
					{
						where: {
							name: req.session.sess_admin.name
						}
					}
				).on("success", (data) ->
					commons.resSuccess res, "修改密码成功"
				).on("failure", (err) ->
					commons.resFail res, 1, err
				)
						
		).on("failure", (err) ->
			commons.resFail res, 1, err
		)

exports.ajaxArtSingleGet = (req, res) ->
	#需要登录才可以访问
	if !req.session.sess_admin	
		commons.resFail res, 1, "需要登录才可以访问"
	else
		id = parseInt req.query.id
		
		models.ArtSingle.find({
			where: {
				id: id
			}
		}).on("success", (data) ->
			commons.resSuccess res, "请求成功", data
		).on("failure", (err) ->
			commons.resFail res, 1, err
		)

exports.ajaxArtSingleUpdate = (req, res) ->
	#需要登录才可以访问
	if !req.session.sess_admin
		commons.resFail res, 1, "需要登录才可以访问"
	else
		console.log req.body
			
		id = parseInt req.body.id
		content = req.body.content
		models.ArtSingle.update(
			{
				content: content
			},
			{
				where: {
					id: id
				}
			}
		).on("success", (data) ->
			commons.resSuccess res, "更新成功"
		).on("failure", (err) ->
			commons.resFail res, 1, err
		)
		
exports.ajaxDataClassList = (req, res) ->
	#需要登录才可以访问
	if !req.session.sess_admin
		commons.resFail res, 1, "需要登录才可以访问"
	else		
		type = 1
		if req.query.type
			type = parseInt req.query.type
		
		models.DataClass.findAll({
			where: {
				type: type
			},
			order: "sort desc, id desc"
		}).on("success", (data) ->

			commons.resSuccess res, "请求成功", data
					
		).on("failure", (err) ->
			commons.resFail res, 1, err
		)	

exports.ajaxDataClassGet = (req, res) ->
	#需要登录才可以访问
	if !req.session.sess_admin
		commons.resFail res, 1, "需要登录才可以访问"
	else
		id = parseInt req.query.id

		models.DataClass.find({
			where: {
				id: id
			}
		}).on("success", (data) ->
			commons.resSuccess res, "请求成功", data
		).on("failure", (err) ->
			commons.resFail res, 1, err
		)

exports.ajaxDataClassAdd = (req, res) ->
	#需要登录才可以访问
	if !req.session.sess_admin
		commons.resFail res, 1, "需要登录才可以访问"
	else
		id = 0
		if req.query.id
			id = parseInt req.query.id
		
		name = req.query.name
				
		if id != 0
			#更新
			
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
			).on("success", (data) ->
				commons.resSuccess res, "更新成功"
			).on("failure", (err) ->
				commons.resFail res, 1, err
			)
		
		else
			#添加
			models.DataClass.create({
				name: name,
				sort: parseInt(req.query.sort),
				type: parseInt(req.query.type)
			}).on("success", (data) ->
				commons.resSuccess res, "添加成功"
			).on("failure", (err) ->
				commons.resFail res, 1, err
			)
		
exports.ajaxDataClassDel = (req, res) ->
	#需要登录才可以访问
	if !req.session.sess_admin
		commons.resFail res, 1, "需要登录才可以访问"
	else		
		id = parseInt req.query.id
		
		#删除该分类下的数据
		models.Data.destroy({
			where: {
				dataclass_id: id
			}
		}).on("success", (data) ->
			
			#删除分类
			models.DataClass.destroy({
				where: {
					id: id
				}
			}).on("success", (data) ->
				commons.resSuccess res, "删除成功"
			).on("failure", (err) ->
				commons.resFail res, 1, err
			)
						
		).on("failure", (err) ->
			commons.resFail res, 1, err
		)

#ajaxDataList用到的递归获取data表的数据
data_list = (data, total, page, page_size, page_count, res) ->
	
	(data[tmpIndex].getDataClass()).on("success", 
		(dataclass) ->
			data[tmpIndex].dataValues.dataclass = dataclass
			
			dt = new Date ((parseInt data[tmpIndex].add_time) * 1000)
			data[tmpIndex].add_time = dt.format "yyyy-MM-dd hh:mm:ss"
			
			#最后一条数据
			if tmpIndex + 1 >= data.length							
				res_data = {
					page: page,
					page_size: page_size,
					page_count: page_count,
					total: total,
					list: data
				}
				commons.resSuccess res, "请求成功", res_data
				return			
			
			tmpIndex++
			data_list data, total, page, page_size, page_count, res
		
	)

exports.ajaxDataList = (req, res) ->
	#需要登录才可以访问
	if !req.session.sess_admin
		commons.resFail res, 1, "需要登录才可以访问"
	else
		#分页索引和每页显示数
		page = 1
		if req.query.page
			page = parseInt req.query.page
		
		page_size = cfg.PAGE_SIZE
		if req.query.page_size
			page_size = parseInt req.query.page_size
				
		type = 1
		if req.query.type
			type = parseInt req.query.type
		
		models.Data.count({
			where: {
				type: type
			}
		}).on("success", 
			(total) ->
				page_count = commons.pageCount total, page_size
				offset = parseInt ((page - 1) * page_size)

				models.Data.findAll({
					where: {
						type: type
					},
					limit: offset + ", " + page_size,
					order: "sort desc, id desc"
				}).on("success", (data) ->
					
					if data.length == 0
						res_data = {
							page: page,
							page_size: page_size,
							page_count: page_count,
							total: total,
							list: []
						}
						commons.resSuccess res, "请求成功", res_data
						return
										
					tmpIndex = 0
					data_list data, total, page, page_size, page_count, res
					
				).on("failure", (err) ->
					commons.resFail res, 1, err
				)
							
		).on("failure", (err) ->
			commons.resFail res, 1, err
		)

exports.ajaxDataGet = (req, res) ->
	#需要登录才可以访问
	if !req.session.sess_admin
		commons.resFail res, 1, "需要登录才可以访问"
	else
		id = parseInt req.query.id
		models.Data.find({
			where: {
				id: id
			}
		}).on("success", (data) ->
			
			if !data
				commons.resFail res, 1, "找不到数据"
				return			
			
			(data.getDataClass()).on("success", 
				(dataclass) ->
					data.dataValues.dataclass = dataclass
					commons.resSuccess res, "请求成功", data				
			)
						
		).on("failure", (err) ->
			commons.resFail res, 1, err
		)		
	
exports.ajaxDataAdd = (req, res) ->
	#需要登录才可以访问
	if !req.session.sess_admin
		commons.resFail res, 1, "需要登录才可以访问"
	else		
		id = 0
		if req.body.id
			id = parseInt req.body.id
		
		name = null
		if !req.body.name
			commons.resFail res, 1, "名称不能为空"
			return
				
		name = req.body.name
		
		content = null
		if !req.body.content
			commons.resFail res, 1, "内容不能为空"
			return
			
		content = req.body.content
		
		if id != 0
			#更新			
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
			).on("success", (data) ->
				commons.resSuccess res, "更新成功"
			).on("failure", (err) ->
				commons.resFail res, 1, err
			)
			
		else
			#添加
			models.Data.create({
				name: name,
				content: content,
				add_time: parseInt((new Date()).getTime() / 1000),
				dataclass_id: parseInt(req.body.dataclass_id),
				sort: parseInt(req.body.sort),
				type: parseInt(req.body.type),
				hits: 0,
				picture: ""
			}).on("success", (data) ->
				commons.resSuccess res, "添加成功"
			).on("failure", (err) ->
				commons.resFail res, 1, err
			)
		
exports.ajaxDataDel = (req, res) ->
	#需要登录才可以访问
	if !req.session.sess_admin
		commons.resFail res, 1, "需要登录才可以访问"
	else
		id = parseInt req.query.id
		models.Data.destroy({
			where: {
				id: id
			}
		}).on("success", (data) ->
			commons.resSuccess res, "删除成功"
		).on("failure", (err) ->
			commons.resFail res, 1, err
		)
	

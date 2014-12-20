
#¿ØÖÆÆ÷
admin = require "./controllers/admin"
site = require "./controllers/site"

app = 0

exports.startUrls = (app) ->
	this.app = app
	app.get "/admin/index", admin.index
	app.get "/admin/admin", admin.admin
	app.get "/admin/get_code", admin.getCode

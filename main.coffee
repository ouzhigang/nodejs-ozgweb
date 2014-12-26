http = require "http"
express = require "express"
session = require "cookie-session"
cookieParser = require "cookie-parser"
bodyParser = require "body-parser"
ejs = require "ejs"
cfg = require "./cfg"
urls = require "./urls"

app = express()
app.engine "html", ejs.renderFile

app.set "view engine", "ejs"
app.set "views", __dirname + "/views"
app.use express.static (__dirname + "/static")

app.use cookieParser()
app.use bodyParser()

app.use session({
	keys: ["ozgweb"]
})

#url路由
urls.startUrls app

app.on "close",
	(err) ->
		console.log "app close"

(http.createServer app).listen cfg.SERVER_PORT,
	() ->
		console.log "正在运行中..."

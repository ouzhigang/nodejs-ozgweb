
http = require "http"
express = require "express"
cfg = require "./cfg"
urls = require "./urls"

app = express()
app.engine "html", (require "ejs").renderFile

app.set "view engine", "ejs"
app.set "views", __dirname + "/views"
app.use express.static (__dirname + "/static")

#url路由
urls.startUrls app

app.on "close", (err) ->
	console.log("app close")

(http.createServer app).listen cfg.SERVER_PORT, () ->
	console.log("正在运行中...")

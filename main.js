
var http = require("http");
var express = require("express");
var session = require("cookie-session");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var cfg = require("./cfg");
var urls = require("./urls");

var app = express();
app.engine("html", (require("ejs")).renderFile);

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/static"));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
	keys: ["ozgweb"]
}));

//url路由
urls.startUrls(app);

app.on("close",
	function(err) {
		console.log("app close");
	}
);

(http.createServer(app)).listen(cfg.SERVER_PORT,
	function() {
		console.log("正在运行中...");
	}
);

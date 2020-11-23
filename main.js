import http from "http";
import express from "express";
import session from "cookie-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import ejs from "ejs";
import cfg from "./cfg";
import urls from "./urls";

let app = express();
app.engine("html", ejs.renderFile);

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

app.on("close", err => {
		console.log("app close");
	}
);

http.createServer(app).listen(cfg.SERVER_PORT, () => {
		console.log("正在运行中...");
	}
);

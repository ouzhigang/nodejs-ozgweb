
var cfg = require("../cfg")
var commons = require("../commons")

exports.actionIndex = function(req, res) {
	commons.renderTemplate(res, "site/index.html");
};

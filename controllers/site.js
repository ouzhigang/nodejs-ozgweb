
var cfg = require("../cfg")
var commons = require("../commons")

exports.index = function(req, res) {
	commons.renderTemplate(res, "site/index.html");
};

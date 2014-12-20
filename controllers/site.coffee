
cfg = require "../cfg"
commons = require "../commons"

exports.index = (req, res) ->	
	commons.renderTemplate res, "site/index.html"

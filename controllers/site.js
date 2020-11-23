
//import cfg from "../cfg";
import commons from "../commons";

const actionIndex = (req, res) => {
	commons.renderTemplate(res, "site/index.html");
};

export default {
	actionIndex,
};
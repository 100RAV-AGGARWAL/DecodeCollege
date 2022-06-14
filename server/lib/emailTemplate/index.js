var ejs = require('ejs');
var fs = require('fs');
var path = require('path');
var config = require('config');

const templates = {
	"notification": {
		"name": "/templates/notification.html"
	},
	"signup": {
		"name": "/templates/signup.html"
	},
	"articlereview": {
		"name": "/templates/articlereview.html"
	},
	"questionreview": {
		"name": "/templates/questionreview.html"
	},
	"articlecomment": {
		"name": "/templates/articlecomment.html"
	},
	"questionanswer": {
		"name": "/templates/questionanswer.html"
	},
	"businessreview": {
		"name": "/templates/businessreview.html"
	},
	"resetpassword": {
		"name": "/templates/resetpasswordtoken.html",
	},
	"passwordconfirmation": {
		"name": "/templates/passwordconfirmation.html",
	},
	"contactus": {
		"name": "/templates/contactus.html",
	},
	"urgent": {
		"name": "/templates/urgent.html",
	},
}
const getTemplateHtml = function (templateObj, templateName) {
	let fileName = templates[templateName].name;

	var jsonPath = path.join(__dirname, fileName);
	templateObj.websiteUrl = config.get("serverDomain");
	templateObj.websiteName = "Pathlaws";
	templateObj.footer = "Team Kshipta";

	var template = fs.readFileSync(jsonPath, { encoding: 'utf-8' });
	var htmlContent = ejs.render(template, templateObj);
	return htmlContent;
}
module.exports.getTemplateHtml = getTemplateHtml;
var ejs = require('ejs');
var fs = require('fs');
var path = require('path');
var config = require('config');

const templates = {
	"assignmentDeadline": {
		"name": "/templates/assignment_deadline.html"
	},
	"signup": {
		"name": "/templates/signup.html"
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
}
const getTemplateHtml = function (templateObj, templateName) {
	let fileName = templates[templateName].name;

	var jsonPath = path.join(__dirname, fileName);
	templateObj.websiteUrl = config.get("serverDomain");
	templateObj.websiteName = "DecodeCollege";
	templateObj.footer = "Team VirtualBeings";

	var template = fs.readFileSync(jsonPath, { encoding: 'utf-8' });
	var htmlContent = ejs.render(template, templateObj);
	return htmlContent;
}
module.exports.getTemplateHtml = getTemplateHtml;
var keystone = require('keystone');
var Researcher = keystone.list('Researcher');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.dataAvailable = false;
	locals.researchers = {};

	Researcher.model.find().exec(
		function (err, researchers) {
			locals.researchers = researchers;
			locals.dataAvailable = true;
			view.render('browseResearchers');
		}
	);
};

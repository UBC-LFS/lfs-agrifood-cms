var keystone = require('keystone');
var Researcher = keystone.list('Researcher');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'browseResearchers';
	locals.researcher = req.params.researcher;

	view.on('init', function (next) {
		Researcher.model.findOne({
			_id: locals.researcher,
		})
		.exec(function (err, result) {
			locals.researcher = result;
			next();
		});
	});

	view.render('researcher');

};

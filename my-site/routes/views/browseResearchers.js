var keystone = require('keystone');
var Researcher = keystone.list('Researcher');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'browseResearchers';
	locals.researchers = [];

	// Initially load 10 researchers to the page
	view.on('init', function (next) {
		Researcher.paginate({
			page: req.query.page || 1,
			perPage: 10,
		})
		.sort('name')
		.exec(function (err, results) {
			locals.researchers = results;
			next(err);
		});
	});

	// Render the view
	view.render('browseResearchers');

};

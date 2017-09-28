var keystone = require('keystone');
var async = require('async');
var Researcher = keystone.list('Researcher');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'browseResearchers';
	locals.dataAvailable = false;
	locals.researchers = [];
	
	// Initially load 10 researchers to the page
	view.on('init', function (next) {
		var q = Researcher.paginate({
			page: req.query.page || 1,
			perPage: 10,
		}).sort('name');

		// if (locals.researchers) {
		// 	q.where('researcher').in([locals.researchers]);
		// }

		q.exec(function (err, results) {
			locals.researchers = results.results;
			next(err);
		});

	});

	// Render the view
	view.render('browseResearchers');

};

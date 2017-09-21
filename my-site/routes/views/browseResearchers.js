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

	// Load all researchers
	view.on('init', function (next) {

		Researcher.model.find().sort('name').exec(function (err, results) {
			if (err || !results.length) {
				return next(err);
			}

			locals.researchers = results;

			// Load the counts for each category
			async.each(locals.researchers, function (researcher, next) {

				keystone.list('Researcher').model.count().exec(function (err, count) {
					researcher.postCount = count;
					next(err);
				});
			}, function (err) {
				next(err);
			});
		});
	});

	// Load the researchers
	view.on('init', function (next) {
		var q = Researcher.paginate({
			page: req.query.page || 1,
			perPage: 10,
			maxPages: 10,
		}).sort('-name');

		if (locals.researchers) {
			q.where('researcher').in([locals.researchers]);
		}

		q.exec(function (err, results) {
			locals.researcher = results;
			next(err);
		});

	});

	// Render the view
	view.render('browseResearchers');

};

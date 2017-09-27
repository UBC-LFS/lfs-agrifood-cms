var keystone = require('keystone');
var async = require('async');
var Project = keystone.list('Project');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'browseProjects';
	locals.projects = [];

	// Load all projects
	// view.on('init', function (next) {

	// 	Project.model.find().sort('title').exec(function (err, results) {
	// 		if (err || !results.length) {
	// 			return next(err);
	// 		}

	// 		locals.projects = results;

	// 		// Load the counts for each projects
			// async.each(locals.projects, function (project, next) {
			// 	Project.model.count().exec(function (count, err) {
			// 		project.projectCount = count;
			// 		next(err);
			// 	});
			// }, function (err) {
			// 	next(err);
			// });
	// 	});
	// });

	view.on('init', function (next) {
		Project.paginate({
			page: req.query.page || 1,
			perPage: 10,
			maxPages: 10,
		})
		.sort('-title')
		.exec(function (err, results) {
			console.log(results);

			// async.each(results, function (project, next) {
			// 	Project.model.count().exec(function (count, err) {
			// 		project.projectCount = count;
			// 		next(err);
			// 	});
			// }, function (err) {
			// 	next(err);
			// });
			next(err);
		});

	});

	// Render the view
	view.render('browseProjects');

};

var keystone = require('keystone');
var async = require('async');
var Project = keystone.list('Project');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'browseProjects';
	locals.dataAvailable = false;
	locals.projects = [];

	// Load all projects
	view.on('init', function (next) {

		Project.model.find().sort('topic').exec(function (err, results) {
			if (err || !results.length) {
				return next(err);
			}

			locals.projects = results;

			// Load the counts for each category
			async.each(locals.projects, function (project, next) {

				keystone.list('Project').model.count().exec(function (err, count) {
					project.postCount = count;
					next(err);
				});
			}, function (err) {
				next(err);
			});
		});
	});

	// Load the projects
	view.on('init', function (next) {
		var q = Project.paginate({
			page: req.query.page || 1,
			perPage: 10,
			maxPages: 10,
		}).sort('-topic');

		if (locals.projects) {
			q.where('project').in([locals.projects]);
		}

		q.exec(function (err, results) {
			locals.project = results;
			next(err);
		});

	});

	// Render the view
	view.render('browseProjects');

};

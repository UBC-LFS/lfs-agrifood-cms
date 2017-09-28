var keystone = require('keystone');
var async = require('async');
var Project = keystone.list('Project');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'browseProjects';
	locals.projects = [];
	
	// Initially load 10 projects to the page
	view.on('init', function (next) {
		Project.paginate({
			page: req.query.page || 1,
			perPage: 10,
		}).sort('title')
		.exec(function (err, results) {
			locals.projects = results.results;
			// async.each(results, function (project, next)  {
			// 	console.log(results);
			// })

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

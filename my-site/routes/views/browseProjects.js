var keystone = require('keystone');
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
		})
		.sort('title')
		.exec(function (err, results) {
			locals.projects = results;
			next(err);
		});
	});

	// Render the view
	view.render('browseProjects');

};

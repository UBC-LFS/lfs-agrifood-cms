var keystone = require('keystone');
var Project = keystone.list('Project');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'browseProjects';
	locals.project = req.params.project;

	view.on('init', function (next) {
		Project.model.findOne({
			_id: locals.project,
		})
		.exec(function (err, result) {
			locals.project = result;
			next();
		});
	});

	view.render('project');

};

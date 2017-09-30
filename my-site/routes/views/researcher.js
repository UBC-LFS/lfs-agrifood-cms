var keystone = require('keystone');
var Researcher = keystone.list('Researcher');
var Project = keystone.list('Project');

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
			// Find all projects where the current researcher is a collaborator so we can list all of his/her projects
			// by title, and link to their pages using their ObjectIds.
			Project.model.find({ researchers: result.id })
				.exec(function (err, projectResult) {
					locals.projects = projectResult;
					next();
				});
		});
	});

	view.render('researcher');

};

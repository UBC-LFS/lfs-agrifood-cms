var keystone = require('keystone');
var Project = keystone.list('Project');
var Researcher = keystone.list('Researcher');

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
			locals.researcherIds = result.researchers;
			// Find all relevant researchers for the current project, so we can display their names and use their
			// ObjectIds to link to their pages.
			Researcher.model.find({
				_id: { $in: locals.researcherIds },
			})
			.exec(function (err, researchersResult) {
				locals.researchersList = researchersResult;
				next();
			});
		});
	});

	view.render('project');

};

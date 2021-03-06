var keystone = require('keystone');
var Project = keystone.list('Project');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'submitProject';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.projectSubmitted = false;

	view.on('post', { action: 'submitProject' }, function (next) {
		var newProject = new Project.model();

		var updater = newProject.getUpdateHandler(req);

		updater.process(req.body, {
			flashErrors: true,
			fields: 'researchers, title, institution, faculty, department, summary, start, end, funding, topic, awardType',
			errorMessage: 'There was a problem submitting your submit request:',
		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.projectSubmitted = true;
			}
			next();
		});
	});
	view.render('submitProject');
};

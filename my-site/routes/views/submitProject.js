var keystone = require('keystone');
var Project = keystone.list('Project');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'submitProject';
	locals.formData = req.body || {};
	locals.validationErrors = {};

	view.on('post', { action: 'submitProject' }, function (next) {
		var newProject = new Project.model();

		var updater = newProject.getUpdateHandler(req);

		updater.process(req.body, {
			flashErrors: true,
			fields: 'topic, title, summary',
			errorMessage: 'There was a problem submitting your submit request:',
		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				req.flash('success', 'Your project was submitted.');
			}
			next();
		});
	});
	view.render('submitProject');
};

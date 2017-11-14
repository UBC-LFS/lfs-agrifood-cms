var keystone = require('keystone');
var Researcher = keystone.list('Researcher');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'index';
	locals.researcher = req.params.researcher;

	view.on('init', function (next) {
		Researcher.model.find({}, { name: 1, _id: 0 })
		.exec(function (err, result) {
			locals.researcher = result.map(a => a.name);
			next();
		});
	});

	// Render the view
	view.render('index');
};

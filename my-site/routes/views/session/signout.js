var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var	locals = res.locals;

	locals.section = 'session';

	keystone.session.signout(req, res, function () {
		res.redirect('/');
	});

};

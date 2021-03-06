var keystone = require('keystone');
var async = require('async');
var utils = keystone.utils;

exports = module.exports = function (req, res) {

	if (req.user) {
		return res.redirect(req.cookies.target || '/submitProject');
	}

	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'session';
	locals.form = req.body;

	view.on('post', {
		action: 'join',
	}, function (next) {

		async.series([

			function (cb) {

				if (!req.body.firstname || !req.body.lastname || !req.body.institution || !req.body.department || !req.body.email || !req.body.password) {
					req.flash('error', 'Please enter a name, institution, department, email, and password.');
					return cb(true);
				}

				return cb();

			},

			function (cb) {

				keystone.list('User').model.findOne({
					email: req.body.email,
				}, function (err, user) {

					if (err || user) {
						req.flash('error', 'User already exists with that email address.');
						return cb(true);
					}

					return cb();

				});

			},

			function (cb) {

				var userData = {
					name: {
						first: req.body.firstname,
						last: req.body.lastname,
					},
					institution: req.body.institution,
					email: req.body.email,
					password: req.body.password,

					website: req.body.website,
				};

				var User = keystone.list('User').model;
				var newUser = new User(userData);

				newUser.save(function (err) {
					return cb(err);
				});

			},

		], function (err) {

			if (err) return next();

			var onSuccess = function () {
				if (req.body.target && !/join|signin/.test(req.body.target)) {
					console.log('[join] - Set target as [' + req.body.target + '].');
					res.redirect(req.body.target);
				} else {
					res.redirect('/submitProject');
				}
			};

			var onFail = function (e) {
				if (!utils.isEmail(req.body.email)) {
					req.flash('error', 'Please use a valid email format.');
				} else {
					req.flash('error', 'There was a problem signing you in, please try again.');
				}
				return next();
			};

			keystone.session.signin({
				email: req.body.email,
				password: req.body.password,
			}, req, res, onSuccess, onFail);

		});

	});

	view.render('session/join');

};

/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
var _ = require('lodash');
var querystring = require('querystring');
var keystone = require('keystone');


/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
exports.initLocals = function (req, res, next) {

	var locals = res.locals;
	locals.navLinks = [{
		label: 'Home',
		key: 'index',
		href: '/',
	},
	{
		label: 'Browse Projects',
		key: 'browseProjects',
		href: '/browseProjects',
	},
	{
		label: 'Browse Researchers',
		key: 'browseResearchers',
		href: '/browseResearchers',
	},
	{
		label: 'Contact',
		key: 'contact',
		href: '/contact',
	}];

	locals.user = req.user;

	locals.basedir = keystone.get('basedir');

	locals.page = {
		title: 'BC Agri-food Database',
		path: req.url.split('?')[0], // strip the query - handy for redirecting back to the page
	};

	locals.qs_set = qs_set(req, res);

	if (req.cookies.target && req.cookies.target === locals.page.path) res.clearCookie('target');


	next();
};

/**
	Inits the error handler functions into `req`
*/

exports.initErrorHandlers = function (req, res, next) {
	res.err = function (err, title, message) {
		res.status(500).render('errors/500', {
			err: err,
			errorTitle: title,
			errorMsg: message,
		});
	};

	res.notfound = function (title, message) {
		res.status(404).render('errors/404', {
			errorTitle: title,
			errorMsg: message,
		});
	};

	next();
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};
	res.locals.messages = _.some(flashMessages, function (msgs) {
		return msgs.length;
	}) ? flashMessages : false;
	next();
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/signin');
	} else {
		next();
	}
};

/**
	Returns a closure that can be used within views to change a parameter in the query string
	while preserving the rest.
*/

var qs_set = exports.qs_set = function (req, res) {
	return function qs_set (obj) {
		var params = _.clone(req.query);
		for (var i in obj) {
			if (obj[i] === undefined || obj[i] === null) {
				delete params[i];
			} else if (obj.hasOwnProperty(i)) {
				params[i] = obj[i];
			}
		}
		var qs = querystring.stringify(params);
		return req.path + (qs ? '?' + qs : '');
	};
};

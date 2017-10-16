/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initErrorHandlers);
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
};

// Handle 404 errors
keystone.set('404', function (req, res, next) {
	res.notfound();
});

// Handle other errors
keystone.set('500', function (err, req, res, next) {
	var title, message;
	if (err instanceof Error) {
		message = err.message;
		err = err.stack;
	}
	res.status(500).render('errors/500', {
		err: err,
		errorTitle: title,
		errorMsg: message,
	});
});

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	app.get('/', routes.views.index);
	app.all('/browseProjects', routes.views.browseProjects);
	app.all('/browseProjects/project/:project', routes.views.project);
	app.all('/browseResearchers', routes.views.browseResearchers);
	app.all('/browseResearchers/researcher/:researcher', routes.views.researcher);
	app.all('/contact', routes.views.contact);
	app.all('/submitProject', routes.views.submitProject);
	app.all('/search', routes.views.search);

	// Session
	app.all('/join', routes.views.session.join);
	app.all('/signin', routes.views.session.signin);
	app.get('/signout', routes.views.session.signout);
	app.all('/forgot-password', routes.views.session['forgot-password']);
	app.all('/reset-password/:key', routes.views.session['reset-password']);

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};

var keystone = require('keystone');
var Project = keystone.list('Project');
const http = require('http');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.formData = req.body || {};
	locals.section = 'search';
	locals.projects = [];
	locals.searched = false;

	view.on('post', { action: 'search' }, function (next) {
		console.log(locals.formData.searchText);
		query = '/solr/agrifood_projects_core/select?q=title:*' + locals.formData.searchText + '*';
		var options = {
			host: 'localhost',
			port: 8983,
			path: query
		};

		callback = function(response) {
			var str = '';

			//another chunk of data has been recieved, so append it to `str`
			response.on('data', function (chunk) {
				str += chunk;
			});

			//the whole response has been recieved, so we just print it out here
			response.on('end', function () {
				console.log(str);
				resp = JSON.parse(str).response;
				total = resp.numFound;
				locals.projects = JSON.parse(str).response.docs;
				next();
			});
		}

		http.request(options, callback).end();
	})

	// Render the view
	view.render('search');

};

var keystone = require('keystone');
var Researcher = keystone.list('Researcher');
var Project = keystone.list('Project');
const https = require('https');

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
					initResearcherSummary(locals.researcher.orcid, next);
				});
		});
	});

	function initResearcherSummary (orcID, next) {
		// Get the works of current researcher by using OrcID public API
		if (orcID === null) {
			next();
			return;
		}
		var endpoint = '/v2.1/' + orcID + '/works';
		var options = {
			host: 'pub.orcid.org',
			path: endpoint,
			headers: { 'Accept': 'application/json' },
		};

		var callback = function (response) {
			var str = '';
			// A chunk of data has been received
			response.on('data', function (chunk) {
				str += chunk;
			});

			// The whole response has been received
			response.on('end', function () {
				// Parse the response and set the locals to be used by the client
				let resp = JSON.parse(str);
				locals.works = [];
				locals.otherWorks = {};
				for (let i = 0; i < resp.group.length; i++) {
					locals.works.push(resp.group[i]['work-summary'][0]);
				}
				for (let work of locals.works) {
					let title = work.title.title.value;
					locals.otherWorks[title] = work['external-ids']['external-id'][0];
					if (locals.otherWorks[title]['external-id-type'] === 'doi') {
						locals.otherWorks[title].otherWorkUrl = 'https://doi.org/' + locals.otherWorks[title]['external-id-value'];
					}
				}
				next();
			});
		};

		https.get(options, callback).end();
	}

	view.render('researcher');

};

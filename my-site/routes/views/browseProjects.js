var keystone = require('keystone');
const http = require('http');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	var maxItemsPerPage = 50;

	// Init locals
	locals.formData = req.body || {};
	locals.section = 'browseProjects';
	locals.projects = [];
	locals.searched = false;
	locals.currentPage = 1;
	locals.totalPages = 0;
	locals.first = 0;
	locals.last = 0;
	locals.total = 0;
	locals.pages = [];
	locals.previous = false;
	locals.next = false;
	locals.query = '';

	view.on('get', function (next) {
		if (req.query.page) {
			// If the page and search query are specified, search Solr.
			var start = maxItemsPerPage * (req.query.page - 1);
			locals.query = req.query.query;
			solrSearch(locals.query, start, next);
		} else {
			// If page or search query are not specified, select everything
			solrSearch('', 0, next);
		}
		console.log('reached get');
	});

	// Render the view
	view.render('browseProjects');

	// Helper for searching Solr for a given query.
	// query: String that represents the search query to be used when making a request to Solr
	// start: The row number to start indexing Solr documents at
	// next: Function to run after all the locals are set
	function solrSearch(query, start, next) {
		// Form the Solr query based on the user's search text. Multiple words are handled by searching for an occurrence
		// of any of the words. The response is ordered by relevance. For example: if "food quality" is searched, then
		// the titles containing both words would be at the top, while titles matching one word would come later.
		var wordsToFind = query.split(' ');
		locals.query = wordsToFind[0];
		for (var i = 1; i < wordsToFind.length; i++) {
			locals.query += '* OR *' + wordsToFind[i];
		}
		// This forms a query like the following example: 
		// http://localhost:8983/solr/agrifood_projects_core/select?q=title:*water* OR summary:*water* OR topic:*water*^2
		// This example searches for the keyword "water" with topic being given a higher priority than the other 2 fields.
		var endpoint = encodeURI('/solr/agrifood_projects_core/select?q=title:*' + locals.query + '* OR summary:*' + 
			locals.query + '* OR topic:*' + locals.query + '*^2' +'&rows=' + maxItemsPerPage	+ '&start=' + start);
		var options = {
			host: 'localhost',
			port: 8983,
			path: endpoint,
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
				var resp = JSON.parse(str).response;
				locals.total = resp.numFound;
				locals.projects = JSON.parse(str).response.docs;
				locals.currentPage = req.query.page || 1;
				locals.totalPages = Math.ceil(locals.total / maxItemsPerPage);
				locals.first = (locals.currentPage - 1) * maxItemsPerPage + 1;
				if (locals.currentPage !== 1) {
					locals.previous = locals.currentPage - 1;
				} else {
					locals.previous = false;
				}
				if (locals.currentPage == locals.totalPages) {
					locals.next = false;
				} else {
					locals.next = locals.currentPage + 1;
				}
				if (locals.currentPage == locals.totalPages) {
					locals.last = locals.total;
				} else {
					locals.last = locals.currentPage * maxItemsPerPage;
				}
				for (var i = 0; i < locals.totalPages; i++) {
					if (i == maxItemsPerPage) {
						locals.pages[i] = '...';
					} else {
						locals.pages[i] = i + 1;
					}
				}
				next();
			});
		};

		http.request(options, callback).end();
	}
};

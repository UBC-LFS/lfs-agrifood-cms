var keystone = require('keystone');

/**
 * Researcher Model
 * =============
 */

var Researcher = new keystone.List('Researcher');

Researcher.add({
	name: { type: String, required: true },
	department: { type: String },
	institution: { type: String },
	orcid: {type: String}
});

Researcher.defaultSort = '-name';
Researcher.defaultColumns = 'name, department, institution, orcid';
Researcher.register();

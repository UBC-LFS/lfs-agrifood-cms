var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Researcher Model
 * =============
 */

var Researcher = new keystone.List('Researcher');

Researcher.add({
	name: { type: String, required: true },
	department: { type: String, required: false },
	institution: { type: String, required: false },
});

Researcher.defaultSort = '-name';
Researcher.defaultColumns = 'name, department, institution';
Researcher.register();

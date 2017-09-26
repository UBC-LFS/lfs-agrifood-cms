var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Project Model
 * =============
 */

var Project = new keystone.List('Project', {
	map: { name: 'title' },
});

Project.add({
	researchers: { type: Types.Relationship, ref: 'Researcher', required: true, initial: true },
	title: { type: String, required: true },
	institution: { type: String },
	faculty: { type: String },
	department: { type: String },
	summary: { type: Types.Markdown },
	start: { type: Types.Date },
	end: { type: Types.Date },
	funding: { type: String },
	topic: { type: String },
	awardType: { type: String },
});

Project.defaultSort = '-title';
Project.defaultColumns = 'researchers, title, institution, faculty, department, summary, start, end, funding, topic, awardType';
Project.register();

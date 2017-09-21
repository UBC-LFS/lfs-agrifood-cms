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
	researchers: { type: Types.Relationship, ref: 'Researcher' },
	title: { type: String, required: true },
	department: { type: String },
	institution: { type: String },
	summary: { type: Types.Markdown },
	start: { type: Types.Date },
	end: { type: Types.Date },
	funding: { type: String },
	topic: { type: String },
});

Project.defaultSort = '-title';
Project.defaultColumns = 'title, summary, topic';
Project.register();

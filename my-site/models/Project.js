var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Projects Model
 * =============
 */

var Projects = new keystone.List('Projects', {
	nocreate: true,
	noedit: true,
});

// Todo: researchers should be an array of Name types
Projects.add({
	researchers: { type: Types.TextArray },
	department: { type: String },
	institution: { type: String },
	summary: { type: Types.Markdown, required: true },
	start: { type: Types.Date },
	end: { type: Types.Date },
	funding: { type: String },
	topic: { type: String, required: true },
});

Projects.defaultSort = '-topic';
Projects.defaultColumns = 'summary, topic';
Projects.register();

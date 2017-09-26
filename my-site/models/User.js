var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User');

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
	institution: { type: String, initial: false, required: true, index: true },
	program: { type: String, index: true },
	faculty: { type: String, index: true },
	department: { type: String, index: true },
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'has Admin rights', index: true },
	isApproved: { type: Boolean, label: 'Is an approved user', index: true },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin && this.isApproved;
});

/**
 * Registration
 */
User.defaultColumns = 'name, email, institution, program, faculty, department, isAdmin, isApproved';
User.register();

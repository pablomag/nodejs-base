const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const config = require('config');

const { validateObjectId } = require('../util/validation');

const userSchema = new mongoose.Schema(
{
	name: {
		type: String,
		minlength: 3,
		maxlength: 100,
		trim: true,
		required: true
	},
	email: {
		type: String,
		minlength: 12,
		maxlength: 120,
		trim: true,
		unique: true,
		required: true
	},
	password: {
		type: String,
		minlength: 5,
		maxlength: 100,
		trim: true,
		required: true
	},
	isAdmin: {
		type: Boolean,
		default: false
	}
});

userSchema.methods.generateAuthToken = function()
{
	const token = jwt.sign(
	{
		_id: this._id,
		name: this.name,
		email: this.email,
		isAdmin: this.isAdmin
	}, config.get('jwtPrivateKey'));

	return token;
}

const validate = (newUser) =>
{
	const schema = {
		_id: Joi.object().optional(),
		name: Joi.string().min(3).max(100).required(),
		email: Joi.string().email().min(12).max(120).required(),
		password: Joi.string().min(5).max(100).required(),
		isAdmin: Joi.boolean().optional()
	};

	if (newUser._id) {
		const invalidObjectId = validateObjectId('_id', newUser._id);

		if (invalidObjectId) return invalidObjectId;
	}

	return Joi.validate(newUser, schema);
}

module.exports.User = mongoose.model('User', userSchema);
module.exports.User.validate = validate;

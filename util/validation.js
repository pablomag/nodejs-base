const mongoose = require('mongoose');

function validateObjectId(field, objectId)
{
	if (!mongoose.Types.ObjectId.isValid(objectId))
		return error = { error: { isJoi: true, name: 'ValidationError',
							details: [{ message: `Validation error: Invalid objectId ${field}` }] }};

	return false;
};

module.exports.validateObjectId = validateObjectId;

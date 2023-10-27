const stripModel = (model, includeTimestamps = false) => {
	if (model.toObject) {
		const { _id, __v, createdAt, updatedAt, ...otherFields } = model.toObject()

		if (includeTimestamps) {
			return { createdAt, updatedAt, ...otherFields }
		}
		return { ...otherFields }
	}
	return model
}

exports.stripModel = stripModel

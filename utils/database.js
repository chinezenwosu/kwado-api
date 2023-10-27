const stripModel = (model, includeTimestamps = false) => {
  if (model.toObject) {
    // eslint-disable-next-line no-unused-vars
    const { _id, __v, createdAt, updatedAt, ...otherFields } = model.toObject()

    if (includeTimestamps) {
      return { createdAt, updatedAt, ...otherFields }
    }
    return { ...otherFields }
  }
  return model
}

exports.stripModel = stripModel

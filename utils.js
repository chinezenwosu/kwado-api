const DOCUMENT_PREFIX = 'kwadoc:'

const getDocumentHash = (key) => {
  return `${DOCUMENT_PREFIX}${key}`
}

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

export { DOCUMENT_PREFIX, getDocumentHash, stripModel }

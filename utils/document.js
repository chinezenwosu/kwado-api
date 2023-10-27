const DOCUMENT_PREFIX = 'kwadoc:'

const getDocumentHash = (key) => {
  return `${DOCUMENT_PREFIX}${key}`
}

exports.DOCUMENT_PREFIX = DOCUMENT_PREFIX
exports.getDocumentHash = getDocumentHash

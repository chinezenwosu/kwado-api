const DOCUMENT_PREFIX = 'kwadoc:'

const getDocumentHash = (key) => {
  return `${DOCUMENT_PREFIX}${key}`
}

export { DOCUMENT_PREFIX, getDocumentHash }
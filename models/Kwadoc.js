const { Schema, model } = require('mongoose')

const kwadocSchema = new Schema({
  title: String,
  slug: String,
  published: Boolean,
  author: String,
  content: Array,
}, {
  timestamps: true,
})

const Kwadoc = model('Kwadoc', kwadocSchema)
export default Kwadoc
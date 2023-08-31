import mongoose from 'mongoose'
const { Schema, model } = mongoose

const kwadocSchema = new Schema({
  title: String,
  slug: String,
  published: Boolean,
  author: String,
  content: Array,
  createdAt: Date,
  updatedAt: Date,
})

const Kwadoc = model('Kwadoc', kwadocSchema)
export default Kwadoc
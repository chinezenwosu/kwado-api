const { Schema, model } = require('mongoose')

const tagSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Tag name is required'],
      unique: [true, 'Tag name has to be unique'],
    },
    description: {
      type: String,
    },
    slug: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

const Tag = model('Tag', tagSchema)
module.exports = Tag

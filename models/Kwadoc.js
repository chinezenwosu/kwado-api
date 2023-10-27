const { Schema, model } = require('mongoose')

const userRole = {
  ADMIN: 0,
  EDITOR: 1,
  VIEWER: 2,
}

const kwadocSchema = new Schema(
  {
    title: String,
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    content: Map,
    html: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    publishedAt: Date,
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    users: [
      {
        role: {
          type: Number,
          enum: Object.values(userRole),
          default: userRole.VIEWER,
        },
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)

const Kwadoc = model('Kwadoc', kwadocSchema)
Kwadoc.userRoles = userRole
module.exports = Kwadoc

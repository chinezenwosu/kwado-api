const Kwadoc = require('../models/Kwadoc.js')

const handleError = (e) => {
  throw new Error(e)
}

class KwadocController {
  async createKwadoc (data) {
    try {
      let newKwadoc = new Kwadoc(data)
      const kwadoc = await newKwadoc.save()
      return kwadoc
    }
    catch (e) {
      handleError(e)
    }
  }

  async getKwadocs () {
    try {
      const kwadocs = await Kwadoc.find({})
      return kwadocs
    }
    catch (e) {
      handleError(e)
    }
  }

  async getKwadocById (id) {
    try {
      const kwadoc = await Kwadoc.findById(id)
      return kwadoc
    }
    catch (e) {
      handleError(e)
    }
  }

  async getKwadocBy (prop, value) {
    try {
      const kwadoc = await Kwadoc.findOne({ [prop]: value })
      return kwadoc
    }
    catch (e) {
      handleError(e)
    }
  }

  async updateKwadoc (id, data) {
    try {
      const kwadoc = await Kwadoc.findOneAndUpdate({ _id: id }, { $set: data })
      return kwadoc
    }
    catch (e) {
      handleError(e)
    }
  }

  async updateKwadocWhere (condition, data) {
    try {
      const kwadoc = await Kwadoc.findOneAndUpdate(condition, { $set: data })
      return kwadoc
    }
    catch (e) {
      handleError(e)
    }
  }

  async deleteKwadoc (id) {
    try {
      const kwadoc = await Kwadoc.deleteOne({ _id: id })
      return kwadoc
    }
    catch (e) {
      handleError(e)
    }
  }
}

module.exports = KwadocController

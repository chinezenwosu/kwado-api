import express from 'express';
import { ObjectId } from 'mongodb';

const mongoRouter = function (collection) {
  const router = express.Router();
  
  const errorCatcher = function(inputError, res) {
    console.error(inputError);
    res.status(500);
    res.json({ status: 500, error: inputError })
  }
  
  router.get('/', (req, res) => {
    collection
      .find()
      .toArray()
      .then((docs) => res.json(docs))
      .catch((err) => errorCatcher(err, res));
  });

  router.get('/:id', (req, res) => {
    const id = req.params.id;
    collection
      .findOne({ _id: new ObjectId(id) })
      .then((doc) => res.json(doc))
      .catch((err) => errorCatcher(err, res));
  });

  router.delete('/:id', (req, res) => {
    const id = req.params.id;
    collection
      .deleteOne({ _id: new ObjectId(id) })
      .then(() => collection.find().toArray())
      .then((docs) => res.json(docs))
      .catch((err) => errorCatcher(err, res));
  });

  router.post('/', (req, res) => {
    const newData = req.body;
    collection
      .insertOne(newData)
      .then((result) => {
        res.json(result.insertedId)
      })
      .catch((err) => errorCatcher(err, res));
  });

 router.put('/:id', (req, res) => {
    const itemId = req.params.id;
    const updatedItem = req.body;
    
    collection
      .findOneAndUpdate({ _id: new ObjectId(itemId) }, { $set: updatedItem })
      .then(result => {
        res.json(result.value);
      })
      .catch((err) => errorCatcher(err, res));
  });
  
  return router;
};

export default mongoRouter;
import express from 'express';
import Message from '../models/message';
import Converstation from '../models/converstation';

const router = express.Router();

router.delete('/', (_req, res) => {
  Converstation.deleteMany((err, deleted) => {
    if(err) return res.status(500);
    Message.deleteMany((err) =>{
      if(err) return res.status(500)
      return es.status(200);
    })
  })
});

export default router;

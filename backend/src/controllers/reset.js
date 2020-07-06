import express from 'express';
import Message from '../models/message';
import Users from '../models/user';
import Converstation from '../models/converstation';

const router = express.Router();

router.delete('/', (_req, res) => {
  Converstation.deleteMany((err, deleted) => {
    if(err) return res.status(500);
    Message.deleteMany((err) =>{
      if(err) return res.status(500);
      Users.deleteMany((err) => {
        if(err) return res.status(500)
        return res.status(200);
      });
    });

  })
});

export default router;

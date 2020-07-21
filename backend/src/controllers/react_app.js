import express from 'express';

const router = express.Router();
const path = require('path');

router.use(express.static(path.join(__dirname, '../../../client/build')))

router.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

export default router;
import express, { Request, Response, Router } from 'express';

const router = Router();
const path = require('path');

router.use(express.static(path.join(__dirname, '../../../client/build')))

router.get('/*', (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

export default router;
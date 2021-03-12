import * as express from 'express';
const router = express.Router();

import verify from '../verifyToken';

router.get('/', verify, async (req, res) => {
    res.json(req.user);
})

export default router;
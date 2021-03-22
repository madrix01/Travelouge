import * as express from 'express';




const router = express.Router();


router.get('/', async (req, res) => {
    res.json({page : "feed"})
})

export default router;
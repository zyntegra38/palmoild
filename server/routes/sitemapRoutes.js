import express from 'express';
import { getSiteMap } from '../controllers/siteMapController.js';

const router = express.Router();

// Routes for sites
router.get('/sitemap.xml', async (req, res) => {
    try {
        await getSiteMap(req, res);
    } catch (error) {
        console.error('Error handling sitemap request:', error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;
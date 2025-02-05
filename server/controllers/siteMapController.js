import sitemap from 'sitemap';
import Company from '../models/company.js';
import Category from '../models/category.js';

export const getSiteMap = async (req, res) => {
    try {
        const sm = new sitemap.SitemapStream({ hostname: process.env.CLIENT_URL });
        
        // Add URLs to the sitemap
        sm.write({ url: '/', changefreq: 'monthly', priority: 0.7 });
        sm.write({ url: '/aboutus', changefreq: 'monthly', priority: 0.5 });
        sm.write({ url: '/register', changefreq: 'monthly', priority: 0.5 });
        sm.write({ url: '/contact', changefreq: 'monthly', priority: 0.5 });
        sm.write({ url: '/support', changefreq: 'monthly', priority: 0.5 });
        sm.write({ url: '/forget-password', changefreq: 'monthly', priority: 0.5 });
        sm.write({ url: '/privacy', changefreq: 'monthly', priority: 0.5 });
        sm.write({ url: '/cancellation', changefreq: 'monthly', priority: 0.5 });
        sm.write({ url: '/terms', changefreq: 'monthly', priority: 0.5 });
        sm.write({ url: '/pricing', changefreq: 'monthly', priority: 0.5 });
        sm.write({ url: '/offers', changefreq: 'monthly', priority: 0.5 });
        sm.write({ url: '/terms', changefreq: 'monthly', priority: 0.5 });
        const companies = await Company.find({}, 'company_slug');
        companies.forEach(company => {
            sm.write({ url: `/${company.company_slug}`, changefreq: 'weekly', priority: 0.6 });
        });
        const categories = await Category.find({}, 'slug');
        categories.forEach(category => {
            sm.write({ url: `/c/${category.slug}`, changefreq: 'weekly', priority: 0.6 });
        });


        sm.end();        
        const sitemapContent = await streamToPromise(sm);
        if (res) {
            res.header('Content-Type', 'application/xml');
            res.send(sitemapContent);
        } else {
            console.error('Response object is undefined.');
            res.status(500).send('Internal Server Error');
        }
    } catch (error) {
        console.error('Error generating sitemap:', error);
        if (res) {
            res.status(500).send('Internal Server Error');
        }
    }
};

// Helper function to convert stream to promise
function streamToPromise(stream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', chunk => {
            if (typeof chunk === 'string') {
                chunk = Buffer.from(chunk, 'utf8'); // Convert string to buffer
            }
            chunks.push(chunk);
        });
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
}



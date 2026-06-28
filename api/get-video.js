const axios = require('axios');

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ success: false, error: "দয়া করে একটি লিংক দিন।" });
    }

    try {
        // আপাতত এটি ইনপুট লিংকটিই টেস্ট করার জন্য ব্যাক করবে
        const extractedDirectLink = url; 

        return res.status(200).json({ 
            success: true, 
            directUrl: extractedDirectLink 
        });

    } catch (error) {
        console.error("Scraping Error:", error);
        return res.status(500).json({ success: false, error: "ভিডিও লিংক প্রসেস করতে ব্যর্থ হয়েছে।" });
    }
                                     }

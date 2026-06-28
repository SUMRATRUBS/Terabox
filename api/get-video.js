const axios = require('axios');

export default async function handler(req, res) {
    // CORS এনাবল করা (যাতে অন্য কেউ আপনার API ব্যবহার না করতে পারে)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ success: false, error: "দয়া করে একটি লিংক দিন।" });
    }

    try {
        // একটি থার্ড-পার্টি ফ্রি Terabox Bypass API ব্যবহার করা হচ্ছে
        // (ইন্টারনেটে থাকা যেকোনো ফ্রি API লিংক আপনি এখানে বসাতে পারবেন)
        const bypassApiUrl = `https://terabox-dl.omind.site/api?url=${encodeURIComponent(url)}`;
        
        const response = await axios.get(bypassApiUrl);
        const data = response.data;
        
        // এপিআই থেকে ডিরেক্ট লিংকটি খুঁজে নেওয়া 
        // (API অনুযায়ী রেসপন্স ভিন্ন হতে পারে, তাই কয়েকটি লজিক দেওয়া হলো)
        const directLink = data?.direct_link || data?.url || (data?.[0] && data[0]?.url);

        if (directLink) {
            // ডিরেক্ট লিংক পাওয়া গেলে সেটি ফ্রন্টএন্ডে পাঠানো হবে
            return res.status(200).json({ 
                success: true, 
                directUrl: directLink 
            });
        } else {
            return res.status(404).json({ success: false, error: "ভিডিওর আসল লিংকটি খুঁজে পাওয়া যায়নি।" });
        }

    } catch (error) {
        console.error("API Error:", error.message);
        return res.status(500).json({ success: false, error: "বাইপাস সার্ভারের সাথে কানেক্ট করতে সমস্যা হচ্ছে।" });
    }
    }

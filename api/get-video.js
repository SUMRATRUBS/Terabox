const axios = require('axios');

export default async function handler(req, res) {
    // CORS এনাবল করা
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ success: false, error: "দয়া করে একটি লিংক দিন।" });
    }

    // আমরা ৩টি ভিন্ন ফ্রি বাইপাস সার্ভার ব্যবহার করব (যেকোনো একটি কাজ করবেই আশা করা যায়)
    const apiList = [
        `https://terabox-dl.omind.site/api?url=${encodeURIComponent(url)}`,
        `https://api.terabox-downloader.com/api/get?url=${encodeURIComponent(url)}`,
        `https://terabox-api.vercel.app/api?url=${encodeURIComponent(url)}`
    ];

    let lastError = "অজানা এরর";

    // লুপ চালিয়ে একটির পর একটি API চেক করা হবে
    for (let i = 0; i < apiList.length; i++) {
        try {
            // ৮ সেকেন্ড পর্যন্ত অপেক্ষা করবে, রেসপন্স না পেলে পরেরটায় চলে যাবে
            const response = await axios.get(apiList[i], { timeout: 8000 }); 
            const data = response.data;
            
            // বিভিন্ন API এর লিংক দেওয়ার স্টাইল ভিন্ন হয়, তাই সবগুলোর জন্য চেক করা হচ্ছে
            const directLink = data?.direct_link || data?.url || data?.downloadLink || (data?.[0] && data[0]?.url) || (data?.response && data.response[0]?.link);

            // যদি ডিরেক্ট লিংক পাওয়া যায়, তবে সাথে সাথে ফ্রন্টএন্ডে পাঠিয়ে লুপ বন্ধ করে দেবে
            if (directLink && directLink.startsWith('http')) {
                return res.status(200).json({ 
                    success: true, 
                    directUrl: directLink 
                });
            }
        } catch (error) {
            // যদি এই API কাজ না করে, তাহলে এররটি সেভ করে পরের API ট্রাই করবে
            lastError = error.response ? `Status ${error.response.status}` : error.message;
            continue; 
        }
    }

    // যদি কোনো দুর্ভাগ্যবশত সবগুলো API ফেইল করে, তখন আমরা ফ্রন্টএন্ডে আসল এররটি দেখাব
    return res.status(500).json({ 
        success: false, 
        error: "এই মুহূর্তে সব ফ্রি সার্ভার ডাউন আছে। (আসল এরর: " + lastError + ")" 
    });
}

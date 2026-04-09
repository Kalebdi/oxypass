const axios = require('axios');

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL required' });

    const SECRET_API = process.env.SECRET_BYPASS_API;
    if (!SECRET_API) {
        console.error('SECRET_BYPASS_API not set');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
        const response = await axios.post(SECRET_API, { url }, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000
        });

        const data = response.data;
        if (data.status === 'success' || data.success) {
            const result = data.result || data.url;
            return res.status(200).json({ success: true, result });
        } else {
            return res.status(200).json({ success: false, error: data.message || 'Bypass failed' });
        }
    } catch (error) {
        console.error('Bypass error:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// api/bypass.js
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL diperlukan' });
    
    // Ganti dengan API bypass.vip
    const BYPASS_API = 'https://api.bypass.vip/bypass';
    
    try {
        const response = await fetch(`${BYPASS_API}?url=${encodeURIComponent(url)}`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        
        const data = await response.json();
        
        if (data.status === 'success' && data.result) {
            return res.status(200).json({ success: true, result: data.result });
        } else {
            return res.status(200).json({ success: false, error: data.message || 'Bypass gagal' });
        }
    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ error: 'Gagal menghubungi server bypass' });
    }
}

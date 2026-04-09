// api/bypass.js
// Backend hanya sebagai perantara (proxy) ke API bypass rahasia

export default async function handler(req, res) {
    // CORS header opsional
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL diperlukan' });
    }
    
    // Ambil URL API rahasia dari environment variable Vercel
    const SECRET_API = process.env.SECRET_BYPASS_API;
    
    if (!SECRET_API) {
        console.error('SECRET_BYPASS_API tidak disetel');
        return res.status(500).json({ error: 'Konfigurasi server belum lengkap' });
    }
    
    try {
        // Panggil API eksternal (misal: BaconBypass atau punyamu sendiri)
        const response = await fetch(SECRET_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });
        
        const data = await response.json();
        
        if (data.status === 'success' || data.success) {
            const result = data.result || data.url;
            return res.status(200).json({ success: true, result });
        } else {
            return res.status(200).json({ success: false, error: data.message || 'Bypass gagal' });
        }
    } catch (error) {
        console.error('Error bypass:', error);
        return res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }
}

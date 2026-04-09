export default async function handler(req, res) {
    // Set CORS headers
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

    const SECRET_API = process.env.SECRET_BYPASS_API;
    if (!SECRET_API) {
        console.error('SECRET_BYPASS_API not set');
        return res.status(500).json({ error: 'Konfigurasi server' });
    }

    try {
        const response = await fetch(SECRET_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'success' || data.success) {
            const result = data.result || data.url;
            return res.status(200).json({ success: true, result });
        } else {
            return res.status(200).json({ success: false, error: data.message || 'Bypass gagal' });
        }
    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ error: 'Gagal menghubungi server bypass' });
    }
}

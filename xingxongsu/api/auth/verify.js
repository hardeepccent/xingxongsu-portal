export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { loginId, password, date_from, date_to } = req.body;

  // Vercel Environment Variable se publishers list uthayega (No file upload needed)
  let publishers = [];
  try {
    publishers = JSON.parse(process.env.PUBLISHERS_DATA || '[]');
  } catch (err) {
    console.error('JSON Parse Error:', err);
  }

  const publisher = publishers.find(
    p => (p.email === loginId || p.phone === loginId) && p.password === password
  );

  if (!publisher) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  const AFFISE_API_URL = 'https://digimcorps.g2afse.com/v1/stats/custom';
  const AFFISE_API_KEY = 'a2893a9e0e95db973f9d83a3a26dcfc9'; // Apni real Affise API key yahan daal dena

  try {
    const params = new URLSearchParams({
      'filter[sub1]': publisher.sub_id,
      'date_from': date_from || new Date().toISOString().split('T')[0],
      'date_to': date_to || new Date().toISOString().split('T')[0],
      'fields[]': ['clicks', 'unique_clicks', 'conversions', 'cr', 'payout']
    });

    const response = await fetch(`${AFFISE_API_URL}?${params.toString()}`, {
      headers: { 'api-key': AFFISE_API_KEY }
    });

    const data = await response.json();

    return res.status(200).json({
      success: true,
      sub_id: publisher.sub_id,
      data: data
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
}
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { loginId, password, date_from, date_to } = req.body;

  // Publishers list with their respective sub_ids mapped to Affise
  const publishers = [
    { email: "test@gmail.com", phone: "TEST123", password: "password123", sub_id: "TEST123" },
    { email: "aarushi@mobpine.com", phone: "9876543210", password: "mobpine@123", sub_id: "224" }
  ];

  const publisher = publishers.find(
    p => (p.email === loginId || p.phone === loginId) && p.password === password
  );

  if (!publisher) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  // Instant mock response only for test credentials
  if (publisher.sub_id === 'TEST123') {
    return res.status(200).json({
      success: true,
      sub_id: publisher.sub_id,
      data: {
        clicks: 1250,
        unique_clicks: 1100,
        conversions: 45,
        cr: "3.6%",
        payout: 120.50
      }
    });
  }

  const AFFISE_API_URL = 'https://digimcorps.g2afse.com/v1/stats/custom';
  const AFFISE_API_KEY = 'a2893a9e0e95db973f9d83a3a26dcfc9';

  try {
    const today = new Date().toISOString().split('T')[0];
    const params = new URLSearchParams({
      'filter[sub1]': publisher.sub_id,
      'date_from': date_from || today,
      'date_to': date_to || today
    });

    const fields = ['clicks', 'unique_clicks', 'conversions', 'cr', 'payout'];
    fields.forEach(field => params.append('fields[]', field));

    const response = await fetch(`${AFFISE_API_URL}?${params.toString()}`, {
      headers: { 'api-key': AFFISE_API_KEY }
    });

    const responseText = await response.text();

    // Check if API returned HTML instead of JSON
    if (responseText.trim().startsWith('<')) {
      throw new Error(`API returned HTML instead of JSON: ${responseText.substring(0, 100)}`);
    }

    const data = JSON.parse(responseText);

    return res.status(200).json({
      success: true,
      sub_id: publisher.sub_id,
      data: data
    });
  } catch (err) {
    return res.status(500).json({ 
      error: 'Failed to fetch stats from DB', 
      details: err.message 
    });
  }
}

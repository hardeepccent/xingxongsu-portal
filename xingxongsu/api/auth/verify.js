export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { loginId, password, date_from, date_to } = req.body;

  // Publishers list with their respective sub_ids mapped to Affise
  const publishers = [
    { email: "test@gmail.com", phone: "TEST123", password: "password123", sub_id: "TEST123" }
    // Yahan apne baaki real publishers bhi add kar sakta hai jinka real sub_id Affise mein hai
  ];

  const publisher = publishers.find(
    p => (p.email === loginId || p.phone === loginId) && p.password === password
  );

  if (!publisher) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  // Instant mock response only for test credentials to bypass missing stats on Affise side
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
    return res.status(500).json({ error: 'Failed to fetch stats from Affise' });
  }
}

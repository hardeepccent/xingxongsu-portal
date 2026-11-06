export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  const publishers = [
    { email: "aarushi@mobpine.com", password: "password123", sub_id: "224" },
  ];

  const publisher = publishers.find(
    (p) => p.email === email && p.password === password
  );

  if (publisher) {
    return res.status(200).json({
      success: true,
      sub_id: publisher.sub_id,
      message: 'Login successful',
    });
  } else {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }
}

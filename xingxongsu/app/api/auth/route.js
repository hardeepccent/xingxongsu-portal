import { NextResponse } from 'next/server';

const PUBLISHERS_DB = [
  { 
    email: 'test@publisher.com', 
    password: '123456', 
    sub_id: '57', 
    apiKey: 'YAHAN_PUBLISHER_57_KI_API_KEY',
    offerIds: ['313910'] // Yahan is publisher ki offer IDs daal dena
  },
  { 
    email: 'aarushi@mobpine.com', 
    password: 'password123', 
    sub_id: '224', 
    apiKey: 'f659b021997bb8dce0eb2e0f30b67207',
    offerIds: ['313910', '309108'] // Iski jitni bhi active offer IDs hain
  }
];

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const publisher = PUBLISHERS_DB.find(
      (p) => p.email === email && p.password === password
    );

    if (publisher) {
      return NextResponse.json({
        success: true,
        sub_id: publisher.sub_id,
        offerIds: publisher.offerIds, // Yeh frontend dropdown ke liye bhej rahe hain
        message: 'Login successful'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Invalid email or password'
      }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

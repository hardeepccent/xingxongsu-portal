import { NextResponse } from 'next/server';

const publishers = [
  { email: "aarushi@mobpine.com", password: "password123", sub_id: "224" },
];

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const publisher = publishers.find(
      (p) => p.email === email && p.password === password
    );

    if (publisher) {
      return NextResponse.json({
        success: true,
        sub_id: publisher.sub_id,
        message: 'Login successful',
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}

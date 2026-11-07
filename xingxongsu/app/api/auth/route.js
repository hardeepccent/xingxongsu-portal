import { NextResponse } from 'next/server';
import { PUBLISHERS_DB } from '@/app/publishers';

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
        offerIds: publisher.offerIds,
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

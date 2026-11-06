import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const filePath = path.join(process.cwd(), 'data', 'publishers.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const publishers = JSON.parse(fileData);

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
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

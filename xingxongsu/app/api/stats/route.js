import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('from');
  const endDate = searchParams.get('to');

  // Affise Statistics API endpoint (apne hisab se URL check kar liyo)
  const affiseUrl = `https://api.affise.com/3.0/admin/stats/custom?date_from=${startDate}&date_to=${endDate}&group[0]=offer_id`;

  try {
    const response = await fetch(affiseUrl, {
      headers: {
        'API-Key': process.env.AFFISE_API_KEY, // Teri Affise API key .env mein honi chahiye
      },
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch from Affise' }, { status: 500 });
  }
}

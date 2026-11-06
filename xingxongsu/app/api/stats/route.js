import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  const affiseUrl = `https://api-affise.com/3.0/stats/custom?date_from=${startDate}&date_to=${endDate}&group[0]=offer_id`;

  try {
    const response = await fetch(affiseUrl, {
      headers: {
        'API-Key': process.env.AFFISE_API_KEY,
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch from Affise' }, { status: 500 });
  }
}

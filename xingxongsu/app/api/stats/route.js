import { NextResponse } from 'next/server';

const PUBLISHERS_DB = [
  { email: 'test@publisher.com', password: '123456', sub_id: '57', apiKey: 'YAHAN_PUBLISHER_57_KI_API_KEY' },
  { email: 'aarushi@mobpine.com', password: 'password123', sub_id: '224', apiKey: 'f659b021997bb8dce0eb2e0f30b67207' }
];

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const subId = url.searchParams.get('sub_id');

    if (!startDate || !endDate || !subId) {
      return NextResponse.json({ success: false, message: 'Dates and Sub ID are required' }, { status: 400 });
    }

    const publisher = PUBLISHERS_DB.find(p => String(p.sub_id).trim() === String(subId).trim());
    const apiKey = publisher?.apiKey;

    if (!apiKey) {
      return NextResponse.json({ success: false, message: 'API key not found' }, { status: 401 });
    }

    const affiseUrl = `https://api-digimcorps.affise.com/3.0/stats/custom?slice=by_day&filter[date_from]=${startDate}&filter[date_to]=${endDate}&timezone=Asia%2FKolkata`;

    const response = await fetch(affiseUrl, {
      method: 'GET',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      }
    });

    const textResponse = await response.text();
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(textResponse);
    } catch (e) {
      return NextResponse.json({ success: false, message: 'Non-JSON response', raw: textResponse }, { status: 500 });
    }

    // Yahan hum direct Affise ka raw JSON bhej rahe hain taaki pata chale data kahan hai
    return NextResponse.json({
      success: true,
      rawAffiseData: jsonResponse
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

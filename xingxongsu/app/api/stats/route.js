import { NextResponse } from 'next/server';

const PUBLISHERS_DB = [
  { email: 'test@publisher.com', password: '123456', sub_id: '57', apiKey: 'YAHAN_PUBLISHER_57_KI_API_KEY' },
  { email: 'aarushi@mobpine.com', password: 'password123', sub_id: '224', apiKey: 'a2893a9e0e95db973f9d83a3a26dcfc9' }
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

    const publisher = PUBLISHERS_DB.find(p => String(p.sub_id) === String(subId));
    const apiKey = publisher?.apiKey;

    if (!apiKey) {
      return NextResponse.json({ success: false, message: 'API key not found for this sub_id' }, { status: 401 });
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
    let data;
    try {
      data = JSON.parse(textResponse);
    } catch (e) {
      return NextResponse.json({ success: false, message: 'Non-JSON response from Affise' }, { status: 500 });
    }

    const statsList = data?.data || data?.rows || (Array.isArray(data) ? data : []);
    
    let totalClicks = 0;
    let totalConversions = 0;
    let totalPayout = 0;

    statsList.forEach(row => {
      totalClicks += Number(row?.clicks || row?.unique_clicks || row?.gross_clicks || 0);
      totalConversions += Number(row?.actions || row?.conversions || row?.approved || 0);
      totalPayout += Number(row?.payout || row?.revenue || row?.earnings || 0);
    });

    const calculatedCr = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : '0';

    return NextResponse.json({
      success: true,
      data: {
        clicks: totalClicks,
        unique_clicks: totalClicks,
        conversions: totalConversions,
        cr: `${calculatedCr}%`,
        payout: Number(totalPayout).toFixed(2)
      }
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

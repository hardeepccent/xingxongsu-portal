import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const apiKey = 'a2893a9e0e95db973f9d83a3a26dcfc9';
    
    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const subId = url.searchParams.get('sub_id'); // Yahan hardcode hata diya

    if (!startDate || !endDate || !subId) {
      return NextResponse.json({ success: false, message: 'Dates and Sub ID are required' }, { status: 400 });
    }

    const affiseUrl = `https://api-digimcorps.affise.com/3.0/admin/stats/custom?date_from=${startDate}&date_to=${endDate}&filter[pid]=${subId}`;

    const response = await fetch(affiseUrl, {
      method: 'GET',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log("AFFISE RAW RESPONSE:", JSON.stringify(data, null, 2));
    const uniqueClicks = data?.stats?.unique_clicks || 0;
    const conversions = data?.stats?.conversions || 0;
    const payout = data?.stats?.payout || 0;
    const clicks = uniqueClicks;

    const calculatedCr = uniqueClicks > 0 ? ((conversions / uniqueClicks) * 100).toFixed(2) : '0';
    const cr = `${calculatedCr}%`;

    return NextResponse.json({
      success: true,
      data: {
        clicks,
        unique_clicks: uniqueClicks,
        conversions,
        cr,
        payout
      }
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

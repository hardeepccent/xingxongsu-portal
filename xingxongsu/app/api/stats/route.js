import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const apiKey = 'a2893a9e0e95db973f9d83a3a26dcfc9';
    
    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const subId = url.searchParams.get('sub_id');

    if (!startDate || !endDate || !subId) {
      return NextResponse.json({ success: false, message: 'Dates and Sub ID are required' }, { status: 400 });
    }

    const affiseUrl = `https://api-digimcorps.affise.com/3.0/stats/custom`;

    const response = await fetch(affiseUrl, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slice: ["pid"],
        filter: {
          date_from: startDate,
          date_to: endDate,
          pid: Number(subId)
        }
      })
    });

    const textResponse = await response.text();
    let data;
    try {
      data = JSON.parse(textResponse);
    } catch (e) {
      console.error("AFFISE NON-JSON RESPONSE:", textResponse);
      return NextResponse.json({ 
        success: false, 
        message: 'Affise returned non-JSON response', 
        raw: textResponse.substring(0, 200) 
      }, { status: 500 });
    }

    const statsObj = data?.data?.[0] || data?.stats || {};
    const uniqueClicks = statsObj?.unique_clicks || statsObj?.clicks || 0;
    const conversions = statsObj?.conversions || 0;
    const payout = statsObj?.payout || 0;
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

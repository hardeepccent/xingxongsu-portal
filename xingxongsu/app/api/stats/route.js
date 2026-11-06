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
        slice: ["day"],
        filter: {
          date_from: startDate,
          date_to: endDate,
          affiliate: Number(subId)
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

    console.log("AFFISE RAW RESPONSE:", JSON.stringify(data, null, 2));

    // Affise custom stats returns rows in data array
    const statsList = data?.data || [];
    
    let totalClicks = 0;
    let totalConversions = 0;
    let totalPayout = 0;

    statsList.forEach(row => {
      const clicks = Number(row?.clicks || row?.unique_clicks || 0);
      const conversions = Number(row?.actions || row?.conversions || 0);
      const payout = Number(row?.payout || row?.revenue || 0);

      totalClicks += clicks;
      totalConversions += conversions;
      totalPayout += payout;
    });

    const calculatedCr = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : '0';
    const cr = `${calculatedCr}%`;

    return NextResponse.json({
      success: true,
      data: {
        clicks: totalClicks,
        unique_clicks: totalClicks,
        conversions: totalConversions,
        cr,
        payout: totalPayout.toFixed(2)
      }
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

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

    const affiseUrl = `https://api-digimcorps.affise.com/3.0/stats/custom?slice[0]=day&filter[date_from]=${startDate}&filter[date_to]=${endDate}&filter[pid]=${subId}`;

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
      return NextResponse.json({ 
        success: false, 
        message: 'Affise returned non-JSON response', 
        raw: textResponse.substring(0, 200) 
      }, { status: 500 });
    }

    console.log("AFFISE FULL RAW JSON:", JSON.stringify(data, null, 2));

    const statsList = data?.data || data?.rows || (Array.isArray(data) ? data : []);
    
    let totalClicks = 0;
    let totalConversions = 0;
    let totalPayout = 0;

    statsList.forEach(row => {
      // Check all possible key variations returned by Affise stats API
      const clicks = Number(row?.clicks || row?.unique_clicks || row?.gross_clicks || row?.unique || 0);
      const conversions = Number(row?.actions || row?.conversions || row?.approved || row?.confirmed || 0);
      const payout = Number(row?.payout || row?.revenue || row?.approved_revenue || 0);

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

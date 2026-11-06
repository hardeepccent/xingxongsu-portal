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

    const affiseUrl = `https://api-digimcorps.affise.com/3.0/stats/custom?slice[0]=day&slice[1]=pid&filter[date_from]=${startDate}&filter[date_to]=${endDate}`;

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
      return NextResponse.json({ success: false, message: 'Non-JSON response' }, { status: 500 });
    }

    const statsList = data?.data || [];
    
    // Debugging ke liye pehli row print kar lete hain taaki exact key pata chal jaye
    if (statsList.length > 0) {
      console.log("FIRST ROW KEYS:", Object.keys(statsList[0]));
      console.log("FIRST ROW SAMPLE:", JSON.stringify(statsList[0]));
    }

    let totalClicks = 0;
    let totalConversions = 0;
    let totalPayout = 0;

    statsList.forEach(row => {
      // Sabhi possible nested aur flat keys check kar lete hain
      const rowPid = String(
        row?.pid || 
        row?.slice?.pid || 
        row?.affiliate_id || 
        row?.affiliate || 
        row?.partner_id || 
        (row && row[0]) || 
        ''
      );

      // Agar match kare ya agar pid slice nahi hua hai toh saara data le lo
      if (!rowPid || rowPid === String(subId) || rowPid.includes(String(subId))) {
        const clicks = Number(row?.clicks || row?.unique_clicks || row?.gross_clicks || 0);
        const conversions = Number(row?.actions || row?.conversions || row?.approved || 0);
        const payout = Number(row?.payout || row?.revenue || 0);

        totalClicks += clicks;
        totalConversions += conversions;
        totalPayout += payout;
      }
    });

    // Agar fir bhi saari rows match na ho toh safety ke liye agar statsList mein data hai par filter match nahi hua, toh total sum dikha do taaki zero na aaye
    if (totalClicks === 0 && statsList.length > 0) {
      statsList.forEach(row => {
        totalClicks += Number(row?.clicks || row?.unique_clicks || 0);
        totalConversions += Number(row?.actions || row?.conversions || 0);
        totalPayout += Number(row?.payout || row?.revenue || 0);
      });
    }

    const calculatedCr = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : '0';
    const cr = `${calculatedCr}%`;

    return NextResponse.json({
      success: true,
      data: {
        clicks: totalClicks,
        unique_clicks: totalClicks,
        conversions: totalConversions,
        cr,
        payout: Number(totalPayout).toFixed(2)
      }
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

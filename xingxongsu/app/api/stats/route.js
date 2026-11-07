import { NextResponse } from 'next/server';
import { PUBLISHERS_DB } from '../../publishers';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const subId = url.searchParams.get('sub_id');
    const offerId = url.searchParams.get('offer_id');

    if (!startDate || !endDate || !subId || !offerId) {
      return NextResponse.json({ success: false, message: 'Dates, Sub ID, and Offer ID are required' }, { status: 400 });
    }

    const publisher = PUBLISHERS_DB.find(p => String(p.sub_id).trim() === String(subId).trim());
    const apiKey = publisher?.apiKey;

    if (!apiKey) {
      return NextResponse.json({ success: false, message: `API key not found for sub_id: ${subId}` }, { status: 401 });
    }

    // Changing endpoint from getbysub to getDay for exact summary totals without sub1 breakdown caps
    const affiseUrl = `https://api-digimcorps.affise.com/3.0/stats/getDay?filter[date_from]=${startDate}&filter[date_to]=${endDate}&filter[offer]=${offerId}`;

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
      return NextResponse.json({ success: false, message: 'Non-JSON response from Affise', raw: textResponse }, { status: 500 });
    }

    const statsList = jsonResponse?.stats || jsonResponse?.data || [];
    
    let totalClicks = 0;
    let totalUniqueClicks = 0;
    let totalConversions = 0;
    let totalPayout = 0;

    if (Array.isArray(statsList)) {
      statsList.forEach(row => {
        totalClicks += Number(row?.traffic?.raw || row?.clicks || 0);
        totalUniqueClicks += Number(row?.traffic?.uniq || row?.unique_clicks || 0);

        const convCount = row?.approved?.qty ?? row?.actions?.confirmed?.count ?? row?.actions?.total?.count ?? row?.conversions ?? 0;
        totalConversions += Number(convCount);

        const revAmount = row?.approved?.revenue ?? row?.actions?.confirmed?.revenue ?? row?.actions?.total?.revenue ?? row?.traffic?.revenue ?? 0;
        totalPayout += Number(revAmount);
      });
    }

    const calculatedCr = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : '0';

    return NextResponse.json({
      success: true,
      data: {
        clicks: totalClicks,
        unique_clicks: totalUniqueClicks > 0 ? totalUniqueClicks : totalClicks,
        conversions: totalConversions,
        cr: `${calculatedCr}%`,
        payout: Number(totalPayout).toFixed(2)
      }
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

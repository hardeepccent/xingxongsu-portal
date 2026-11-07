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

    // 1. Parallel mein Stats aur Offer Details dono fetch kar lenge taaki Offer Name 100% mile
    const statsUrl = `https://api-digimcorps.affise.com/3.0/stats/getbysub?filter[date_from]=${startDate}&filter[date_to]=${endDate}&filter[offer]=${offerId}&page=1&limit=100`;
    const offerUrl = `https://api-digimcorps.affise.com/3.0/offer/${offerId}`;

    const [initialRes, offerRes] = await Promise.all([
      fetch(statsUrl, { method: 'GET', headers: { 'api-key': apiKey, 'Content-Type': 'application/json' } }),
      fetch(offerUrl, { method: 'GET', headers: { 'api-key': apiKey, 'Content-Type': 'application/json' } }).catch(() => null)
    ]);

    // Extract Offer Name safely from offer endpoint response
    let fetchedOfferName = '';
    if (offerRes) {
      try {
        const offerJson = await offerRes.json();
        fetchedOfferName = offerJson?.data?.title || offerJson?.offer?.title || offerJson?.data?.name || '';
      } catch (e) {}
    }

    const initialText = await initialRes.text();
    let initialJson;
    try {
      initialJson = JSON.parse(initialText);
    } catch (e) {
      return NextResponse.json({ success: false, message: 'Non-JSON response from Affise', raw: initialText }, { status: 500 });
    }

    let allStats = initialJson?.stats || initialJson?.data || [];
    const totalCount = initialJson?.pagination?.total_count || allStats.length;
    const limit = 100;
    const totalPages = Math.ceil(totalCount / limit);

    // Un-capped pagination loop for remaining pages
    if (totalPages > 1) {
      const pagePromises = [];
      for (let p = 2; p <= totalPages; p++) {
        const pageUrl = `https://api-digimcorps.affise.com/3.0/stats/getbysub?filter[date_from]=${startDate}&filter[date_to]=${endDate}&filter[offer]=${offerId}&page=${p}&limit=${limit}`;
        pagePromises.push(
          fetch(pageUrl, {
            method: 'GET',
            headers: { 'api-key': apiKey, 'Content-Type': 'application/json' }
          }).then(res => res.json()).catch(() => null)
        );
      }

      const results = await Promise.all(pagePromises);
      results.forEach(jsonRes => {
        const statsList = jsonRes?.stats || jsonRes?.data || [];
        if (Array.isArray(statsList) && statsList.length > 0) {
          allStats = allStats.concat(statsList);
        }
      });
    }

    let totalUniqueClicks = 0;
    let totalConversions = 0;
    let totalPayout = 0;

    allStats.forEach(row => {
      totalUniqueClicks += Number(row?.traffic?.uniq || row?.unique_clicks || 0);

      // Fallback check inside stats rows if offer endpoint missed it
      if (!fetchedOfferName) {
        fetchedOfferName = row?.offer_name || row?.offer?.name || row?.offer_title || '';
      }

      const convCount = row?.approved?.qty ?? row?.actions?.confirmed?.count ?? row?.actions?.total?.count ?? row?.conversions ?? 0;
      totalConversions += Number(convCount);

      const revAmount = row?.approved?.revenue ?? row?.actions?.confirmed?.revenue ?? row?.actions?.total?.revenue ?? row?.traffic?.revenue ?? 0;
      totalPayout += Number(revAmount);
    });

    const calculatedCr = totalUniqueClicks > 0 ? ((totalConversions / totalUniqueClicks) * 100).toFixed(2) : '0';

    return NextResponse.json({
      success: true,
      data: {
        offer_name: fetchedOfferName ? `${fetchedOfferName} (ID: ${offerId})` : `Offer ID: ${offerId}`,
        unique_clicks: totalUniqueClicks,
        conversions: totalConversions,
        cr: `${calculatedCr}%`,
        payout: Number(totalPayout).toFixed(2)
      }
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

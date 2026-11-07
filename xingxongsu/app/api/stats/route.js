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

    const affiseUrl = `https://api-digimcorps.affise.com/3.0/stats/getbysub?filter[date_from]=${startDate}&filter[date_to]=${endDate}&filter[offer]=${offerId}`;

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

    return NextResponse.json({
      success: true,
      raw_affise_response: jsonResponse
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

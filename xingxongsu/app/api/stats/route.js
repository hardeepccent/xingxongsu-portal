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

    // Try filtering with pid as string/number and slice by day/pid
    const response = await fetch(affiseUrl, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slice: ["day", "pid"],
        filter: {
          date_from: startDate,
          date_to: endDate,
          pid: Number(subId)
        }
      })
    });

    const textResponse = await response.text();
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(textResponse);
    } catch (e) {
      return NextResponse.json({ success: false, raw_text: textResponse });
    }

    // Return raw Affise response temporarily to inspect structure and data
    return NextResponse.json({
      success: true,
      debug_subId: subId,
      affise_raw: jsonResponse
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

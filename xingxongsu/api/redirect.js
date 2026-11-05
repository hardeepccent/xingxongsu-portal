export default async function handler(req, res) {
  const { offer, pid, preview, clickid, sourceid } = req.query;

  const offerId = offer || req.query.offer_id;
  const partnerId = pid || '57';
  const targetUrl = preview || req.query.target;

  if (offerId && targetUrl) {
    const affiseUrl = `https://digimcorps.g2afse.com/click?offer_id=${offerId}&pid=${partnerId}&sub1=${clickid || ''}&sub2=${sourceid || ''}`;

    try {
      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const clientUa = req.headers['user-agent'] || '';

      await fetch(affiseUrl, {
        headers: {
          'User-Agent': clientUa,
          'X-Forwarded-For': clientIp
        }
      });
    } catch (err) {
      console.error('Tracking Error:', err);
    }

    return res.redirect(302, targetUrl);
  } else {
    return res.redirect(302, targetUrl || 'https://google.com');
  }
}
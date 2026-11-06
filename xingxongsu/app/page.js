'use client';
import { useState } from 'react';

export default function Dashboard() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMetrics = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/stats?startDate=${startDate}&endDate=${endDate}`);
      const result = await res.json();
      setStats(result.data || result.stats || []);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px', color: '#fff', background: '#0b0f19', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#161b22', padding: '15px 20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>Welcome Partner</h2>
        <span style={{ color: '#8b949e' }}>ID: 224</span>
      </div>

      {/* Date Range Picker Section */}
      <div style={{ background: '#161b22', padding: '20px', borderRadius: '8px', display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#8b949e', marginBottom: '5px' }}>START DATE</label>
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
            style={{ background: '#0b0f19', border: '1px solid #30363d', color: '#fff', padding: '10px', borderRadius: '6px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#8b949e', marginBottom: '5px' }}>END DATE</label>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
            style={{ background: '#0b0f19', border: '1px solid #30363d', color: '#fff', padding: '10px', borderRadius: '6px' }}
          />
        </div>
        <button 
          onClick={fetchMetrics} 
          disabled={loading}
          style={{ marginTop: '18px', background: '#238636', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {loading ? 'Fetching...' : 'Fetch Metrics'}
        </button>
      </div>

      {/* Data Table Section */}
      <div style={{ background: '#161b22', padding: '20px', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '15px' }}>Offer Performance</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #30363d', color: '#8b949e', fontSize: '14px' }}>
              <th style={{ padding: '10px' }}>Offer ID</th>
              <th style={{ padding: '10px' }}>Clicks</th>
              <th style={{ padding: '10px' }}>Conversions</th>
              <th style={{ padding: '10px' }}>Payout</th>
            </tr>
          </thead>
          <tbody>
            {stats.length > 0 ? (
              stats.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #21262d' }}>
                  <td style={{ padding: '10px' }}>{item.offer_id || item.offer || 'N/A'}</td>
                  <td style={{ padding: '10px' }}>{item.clicks || 0}</td>
                  <td style={{ padding: '10px' }}>{item.conversions || 0}</td>
                  <td style={{ padding: '10px' }}>${item.payout || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#8b949e' }}>
                  {loading ? 'Loading data from Affise...' : 'No data found. Select date range and click Fetch Metrics.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

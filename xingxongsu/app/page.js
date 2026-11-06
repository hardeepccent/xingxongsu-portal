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
      // Assuming Affise returns data in result.stats or result.data array
      setStats(result.data || result.stats || []);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', color: '#fff', background: '#0b0f19', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#161b22', padding: '15px 20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>Welcome Partner</h2>
        <span style={{ color: '#8b949e' }}>ID: 224</span>
      </div>

      {/* Date Range Picker Section */}
      <div style={{ background: '#161b22', padding: '20px', borderRadius: '8px', display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#8b949e', marginBottom: '5px' }}>START DATE</label>
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
            style={{ padding: '8px', background: '#0d1117', border: '1px solid #30363d', color: '#fff', borderRadius: '4px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#8b949e', marginBottom: '5px' }}>END DATE</label>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
            style={{ padding: '8px', background: '#0d1117', border: '1px solid #30363d', color: '#fff', borderRadius: '4px' }}
          />
        </div>
        <button 
          onClick={fetchMetrics}
          style={{ marginTop: '18px', padding: '9px 20px', background: '#238636', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {loading ? 'Fetching...' : 'Fetch Metrics'}
        </button>
      </div>

      {/* Offer-wise Data Table */}
      <div style={{ background: '#161b22', padding: '20px', borderRadius: '8px' }}>
        <h3>Traffic Performance</h3>
        <table style={{ width: '100%', marginTop: '15px', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #30363d', color: '#8b949e' }}>
              <th style={{ padding: '10px' }}>Offer ID</th>
              <th style={{ padding: '10px' }}>Offer Name</th>
              <th style={{ padding: '10px' }}>Clicks</th>
              <th style={{ padding: '10px' }}>Conversions</th>
            </tr>
          </thead>
          <tbody>
            {stats.length > 0 ? (
              stats.map((row, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #21262d' }}>
                  <td style={{ padding: '10px' }}>{row.offer_id}</td>
                  <td style={{ padding: '10px' }}>{row.offer_name || 'N/A'}</td>
                  <td style={{ padding: '10px' }}>{row.clicks || 0}</td>
                  <td style={{ padding: '10px' }}>{row.conversions || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#8b949e' }}>
                  No data found. Select date range and click fetch.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
// Last updated: November 2026

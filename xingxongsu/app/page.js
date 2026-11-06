'use client';
import { useState } from 'react';

export default function Dashboard() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [metrics, setMetrics] = useState({ clicks: 0, unique_clicks: 0, conversions: 0, cr: '0%', payout: 0 });
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
      if (result.success && result.data) {
        setMetrics(result.data);
      }
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

      {/* Metrics Cards Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
        <div style={{ background: '#161b22', padding: '20px', borderRadius: '8px', border: '1px solid #30363d' }}>
          <div style={{ fontSize: '12px', color: '#8b949e', marginBottom: '5px' }}>TOTAL CLICKS</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#58a6ff' }}>{metrics.clicks}</div>
        </div>
        <div style={{ background: '#161b22', padding: '20px', borderRadius: '8px', border: '1px solid #30363d' }}>
          <div style={{ fontSize: '12px', color: '#8b949e', marginBottom: '5px' }}>UNIQUE CLICKS</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3fb950' }}>{metrics.unique_clicks}</div>
        </div>
        <div style={{ background: '#161b22', padding: '20px', borderRadius: '8px', border: '1px solid #30363d' }}>
          <div style={{ fontSize: '12px', color: '#8b949e', marginBottom: '5px' }}>CONVERSIONS</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d29922' }}>{metrics.conversions}</div>
        </div>
        <div style={{ background: '#161b22', padding: '20px', borderRadius: '8px', border: '1px solid #30363d' }}>
          <div style={{ fontSize: '12px', color: '#8b949e', marginBottom: '5px' }}>CONVERSION RATE</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f78166' }}>{metrics.cr}</div>
        </div>
        <div style={{ background: '#161b22', padding: '20px', borderRadius: '8px', border: '1px solid #30363d' }}>
          <div style={{ fontSize: '12px', color: '#8b949e', marginBottom: '5px' }}>PAYOUT</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2ea043' }}>${metrics.payout}</div>
        </div>
      </div>
    </div>
  );
}

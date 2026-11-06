'use client';
import { useState } from 'react';

export default function Portal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [publisher, setPublisher] = useState({ email: '', sub_id: '' });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [metrics, setMetrics] = useState({ clicks: 0, unique_clicks: 0, conversions: 0, cr: '0%', payout: 0 });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setIsLoggedIn(true);
        setPublisher({ email, sub_id: data.sub_id });
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong. Try again.');
    }
  };

  const fetchMetrics = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/stats?startDate=${startDate}&endDate=${endDate}&sub_id=${publisher.sub_id}`);
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

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0b0f19', fontFamily: 'sans-serif' }}>
        <form onSubmit={handleLogin} style={{ background: '#161b22', padding: '30px', borderRadius: '12px', width: '350px', border: '1px solid #30363d', color: '#fff' }}>
          <h2 style={{ marginBottom: '5px', textAlign: 'center' }}>XingXongSu Portal</h2>
          <p style={{ fontSize: '12px', color: '#8b949e', textAlign: 'center', marginBottom: '20px' }}>GLOBAL ANALYTICS & TRACKING</p>
          
          {error && <div style={{ background: '#f8514922', border: '1px solid #f85149', color: '#f85149', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px' }}>{error}</div>}

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#8b949e', marginBottom: '5px' }}>EMAIL OR PHONE</label>
            <input 
              type="text" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              style={{ width: '100%', background: '#0b0f19', border: '1px solid #30363d', color: '#fff', padding: '10px', borderRadius: '6px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#8b949e', marginBottom: '5px' }}>PASSWORD</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              style={{ width: '100%', background: '#0b0f19', border: '1px solid #30363d', color: '#fff', padding: '10px', borderRadius: '6px', boxSizing: 'border-box' }}
            />
          </div>

          <button type="submit" style={{ width: '100%', background: '#1f6feb', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            Secure Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', color: '#fff', background: '#0b0f19', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#161b22', padding: '15px 20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #30363d' }}>
        <div>
          <h2 style={{ margin: 0 }}>Welcome Partner</h2>
          <span style={{ fontSize: '12px', color: '#8b949e' }}>ID: {publisher.sub_id} ({publisher.email})</span>
        </div>
        <button 
          onClick={() => setIsLoggedIn(false)} 
          style={{ background: '#da3633', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Sign Out
        </button>
      </div>

      <div style={{ background: '#161b22', padding: '20px', borderRadius: '8px', display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', border: '1px solid #30363d' }}>
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
// Force fresh deployment update

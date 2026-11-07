'use client';
import { useState, useEffect } from 'react';

export default function Portal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [publisher, setPublisher] = useState({ email: '', sub_id: '', offerIds: [] });
  const [selectedOffer, setSelectedOffer] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Default date range: Both set to Today, but Start Date can go back up to 7 days
  const getTodayDate = () => new Date().toISOString().split('T')[0];
  const getSevenDaysAgoDate = () => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  };

  const [startDate, setStartDate] = useState(getTodayDate());
  const [endDate, setEndDate] = useState(getTodayDate());
  
  const [metrics, setMetrics] = useState({ offer_name: '', unique_clicks: 0, conversions: 0, cr: '0%', payout: 0 });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setIsLoggedIn(true);
        setPublisher({ email, sub_id: data.sub_id, offerIds: data.offerIds || [] });
        if (data.offerIds && data.offerIds.length > 0) {
          setSelectedOffer(data.offerIds[0]);
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong. Try again.');
    }
  };

  const fetchMetrics = async () => {
    if (!startDate || !endDate || !selectedOffer) {
      alert('Please select start date, end date, and an offer ID');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/stats?startDate=${startDate}&endDate=${endDate}&sub_id=${publisher.sub_id}&offer_id=${selectedOffer}`);
      const result = await res.json();
      if (result.success && result.data) {
        setMetrics(result.data);
      } else {
        alert(result.message || 'Failed to fetch stats');
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'radial-gradient(circle at 50% 20%, #1a1f35 0%, #07090e 100%)', fontFamily: 'Inter, sans-serif' }}>
        <form onSubmit={handleLogin} style={{ background: 'rgba(22, 27, 34, 0.7)', backdropFilter: 'blur(16px)', padding: '40px', borderRadius: '16px', width: '380px', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 20px 40px rgba(0,0,0,0.6)', color: '#fff' }}>
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', background: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 100% )', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>XingXongSu Portal</h2>
            <p style={{ fontSize: '11px', letterSpacing: '1px', color: '#94a3b8', textTransform: 'uppercase', margin: 0 }}>Global Analytics & Tracking</p>
          </div>
          
          {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', textAlign: 'center' }}>{error}</div>}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', letterSpacing: '0.5px', color: '#94a3b8', marginBottom: '6px' }}>EMAIL OR PHONE</label>
            <input 
              type="text" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              style={{ width: '100%', background: 'rgba(11, 15, 25, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', padding: '12px 14px', borderRadius: '8px', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', letterSpacing: '0.5px', color: '#94a3b8', marginBottom: '6px' }}>PASSWORD</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              style={{ width: '100%', background: 'rgba(11, 15, 25, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', padding: '12px 14px', borderRadius: '8px', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>

          <button type="submit" style={{ width: '100%', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)' }}>
            Secure Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', color: '#fff', background: 'radial-gradient(circle at 50% 0%, #111827 0%, #030712 100%)', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Top Navbar Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(17, 24, 39, 0.7)', backdropFilter: 'blur(12px)', padding: '18px 24px', borderRadius: '12px', marginBottom: '24px', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '700' }}>Welcome Partner</h2>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>ID: <strong style={{ color: '#60a5fa' }}>{publisher.sub_id}</strong> ({publisher.email})</span>
        </div>
        <button 
          onClick={() => setIsLoggedIn(false)} 
          style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
        >
          Sign Out
        </button>
      </div>

      {/* Filters Control Bar */}
      <div style={{ background: 'rgba(17, 24, 39, 0.7)', backdropFilter: 'blur(12px)', padding: '20px 24px', borderRadius: '12px', display: 'flex', gap: '20px', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px', letterSpacing: '0.5px' }}>SELECT OFFER</label>
          <select 
            value={selectedOffer} 
            onChange={(e) => setSelectedOffer(e.target.value)}
            style={{ background: '#030712', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', padding: '10px 14px', borderRadius: '8px', height: '42px', outline: 'none', cursor: 'pointer' }}
          >
            {publisher.offerIds.map((id) => (
              <option key={id} value={id}>Offer ID: {id}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px', letterSpacing: '0.5px' }}>START DATE (Last 7 Days)</label>
          <input 
            type="date" 
            value={startDate} 
            min={getSevenDaysAgoDate()}
            max={getTodayDate()}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ background: '#030712', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', padding: '10px 14px', borderRadius: '8px', height: '42px', outline: 'none', boxSizing: 'border-box', colorScheme: 'dark' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px', letterSpacing: '0.5px' }}>END DATE (Today)</label>
          <input 
            type="date" 
            value={endDate} 
            max={getTodayDate()}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ background: '#030712', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', padding: '10px 14px', borderRadius: '8px', height: '42px', outline: 'none', boxSizing: 'border-box', colorScheme: 'dark' }}
          />
        </div>
        <button 
          onClick={fetchMetrics} 
          disabled={loading}
          style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', border: 'none', padding: '0 24px', height: '42px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)' }}
        >
          {loading ? 'Fetching...' : 'Fetch Metrics'}
        </button>
      </div>

      {/* Dynamic Offer Name Header Display */}
      {metrics.offer_name && (
        <div style={{ marginBottom: '20px', fontSize: '15px', fontWeight: '600', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '12px 18px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
          Active Offer: <span style={{ color: '#fff' }}>{metrics.offer_name}</span>
        </div>
      )}

      {/* Metrics Cards Grid (4 Cards Layout - Total Clicks Removed) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        
        <div style={{ background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)', padding: '24px', borderRadius: '14px', border: '1px solid rgba(52, 211, 153, 0.2)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#34d399' }}></div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', marginBottom: '8px', letterSpacing: '0.5px' }}>UNIQUE CLICKS</div>
          <div style={{ fontSize: '30px', fontWeight: '800', color: '#34d399', textShadow: '0 0 20px rgba(52, 211, 153, 0.3)' }}>{metrics.unique_clicks}</div>
        </div>

        <div style={{ background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)', padding: '24px', borderRadius: '14px', border: '1px solid rgba(251, 191, 36, 0.2)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#fbbf24' }}></div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', marginBottom: '8px', letterSpacing: '0.5px' }}>CONVERSIONS</div>
          <div style={{ fontSize: '30px', fontWeight: '800', color: '#fbbf24', textShadow: '0 0 20px rgba(251, 191, 36, 0.3)' }}>{metrics.conversions}</div>
        </div>

        <div style={{ background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)', padding: '24px', borderRadius: '14px', border: '1px solid rgba(248, 113, 113, 0.2)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#f87171' }}></div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', marginBottom: '8px', letterSpacing: '0.5px' }}>CONVERSION RATE</div>
          <div style={{ fontSize: '30px', fontWeight: '800', color: '#f87171', textShadow: '0 0 20px rgba(248, 113, 113, 0.3)' }}>{metrics.cr}</div>
        </div>

        <div style={{ background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)', padding: '24px', borderRadius: '14px', border: '1px solid rgba(45, 212, 191, 0.2)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#2dd4bf' }}></div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', marginBottom: '8px', letterSpacing: '0.5px' }}>TOTAL PAYOUT</div>
          <div style={{ fontSize: '30px', fontWeight: '800', color: '#2dd4bf', textShadow: '0 0 20px rgba(45, 212, 191, 0.3)' }}>${metrics.payout}</div>
        </div>

      </div>
    </div>
  );
}

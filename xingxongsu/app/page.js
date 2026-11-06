'use client';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Aaj ki date default set karne ke liye
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);
  }, []);

  const fetchStats = async (forceRefresh = false) => {
    if (!startDate || !endDate) return;
    
    const cacheKey = `affise_stats_${startDate}_${endDate}`;
    const cachedTimeKey = `${cacheKey}_time`;
    const now = new Date().getTime();

    // 1. Check LocalStorage Cache (5 minutes TTL)
    if (!forceRefresh) {
      const cachedData = localStorage.getItem(cacheKey);
      const cachedTime = localStorage.getItem(cachedTimeKey);
      if (cachedData && cachedTime && (now - cachedTime < 300000)) {
        console.log("Loaded from Local Cache (0 API Cost)");
        setStatsData(JSON.parse(cachedData));
        return;
      }
    }

    // 2. Fetch Fresh Data
    setLoading(true);
    try {
      const res = await fetch(`/api/stats?from=${startDate}&to=${endDate}`);
      const json = await res.json();
      
      const results = json.data || []; // Affise response structure ke mutabiq adjust kar le
      setStatsData(results);

      // Save to LocalStorage
      localStorage.setItem(cacheKey, JSON.stringify(results));
      localStorage.setItem(cachedTimeKey, now);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Affise Analytics Dashboard</h1>

      {/* Date Filters & Buttons */}
      <div className="flex gap-4 mb-6 items-center bg-gray-100 p-4 rounded-lg">
        <div>
          <label className="block text-sm font-medium">From:</label>
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">To:</label>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            className="border p-2 rounded"
          />
        </div>
        <button 
          onClick={() => fetchStats(false)}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-5 hover:bg-blue-700"
        >
          {loading ? 'Loading...' : 'Fetch Stats'}
        </button>
        <button 
          onClick={() => fetchStats(true)}
          className="bg-gray-600 text-white px-4 py-2 rounded mt-5 hover:bg-gray-700"
          title="Bypasses cache and fetches fresh data from Affise"
        >
          Force Refresh
        </button>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Offer ID</th>
              <th className="border border-gray-300 p-2">Offer Name</th>
              <th className="border border-gray-300 p-2">Clicks</th>
              <th className="border border-gray-300 p-2">Conversions</th>
              <th className="border border-gray-300 p-2">CR (%)</th>
            </tr>
          </thead>
          <tbody>
            {statsData.length > 0 ? (
              statsData.map((row, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 p-2">{row.offer_id}</td>
                  <td className="border border-gray-300 p-2 font-medium">{row.offer_name || 'N/A'}</td>
                  <td className="border border-gray-300 p-2">{row.clicks}</td>
                  <td className="border border-gray-300 p-2">{row.conversions}</td>
                  <td className="border border-gray-300 p-2">{row.cr}%</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No data found for selected dates. Click 'Fetch Stats'.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

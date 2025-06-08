import React, { useState } from 'react';
import { dataService } from '@/services/dataService';
import { ChartContainer } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [subAssetForm, setSubAssetForm] = useState({
    vehicleNumber: '',
    vehicleType: '',
    tankCapacity: ''
  });
  const [subAssets, setSubAssets] = useState<any[]>([]);
  const [loadingSubAssets, setLoadingSubAssets] = useState<boolean>(false);
  const [operators, setOperators] = useState<any[]>([]);
  const [loadingOperators, setLoadingOperators] = useState<boolean>(false);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState<boolean>(false);
  // Dialog state for notifications
  const [dialog, setDialog] = useState<{ open: boolean; title: string; description?: string; variant?: string }>({ open: false, title: '', description: '', variant: undefined });
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<string | null>(null);

  const showDialog = (title: string, description?: string, variant?: string) => {
    setDialog({ open: true, title, description, variant });
  };
  const closeDialog = () => setDialog({ ...dialog, open: false });

  const handleSubAssetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subAssetForm.vehicleNumber || !subAssetForm.vehicleType || !subAssetForm.tankCapacity) {
      showDialog('Missing Information', 'Please fill in all required fields.', 'error');
      return;
    }
    await dataService.addSubAssetDetails(subAssetForm);
    setSubAssetForm({ vehicleNumber: '', vehicleType: '', tankCapacity: '' });
    showDialog('Sub-Asset Added', 'Sub-asset details have been saved successfully.', 'success');
    setActiveView('viewSubAssets');
  };

  // Fetch sub-assets
  React.useEffect(() => {
    if (activeView === 'viewSubAssets') {
      setLoadingSubAssets(true);
      (async () => {
        const data = await dataService.getSubAssetDetails();
        setSubAssets(data);
        setLoadingSubAssets(false);
      })();
    }
  }, [activeView]);

  // Fetch operators
  React.useEffect(() => {
    if (activeView === 'viewOperators') {
      setLoadingOperators(true);
      (async () => {
        const data = await dataService.getOperatorWithAssetDetails();
        setOperators(data);
        setLoadingOperators(false);
      })();
    }
  }, [activeView]);

  // Fetch refueling history
  React.useEffect(() => {
    if (activeView === 'refuelingHistory') {
      setLoadingHistory(true);
      (async () => {
        const data = await dataService.getRefuelingWithOperator();
        setHistory(data);
        setLoadingHistory(false);
      })();
    }
  }, [activeView]);

  // Fetch alerts
  React.useEffect(() => {
    if (activeView === 'alerts') {
      setLoadingAlerts(true);
      (async () => {
        const data = await dataService.getUnregisteredVehicleAlerts();
        setAlerts(data);
        setLoadingAlerts(false);
      })();
    }
  }, [activeView]);

  // Helper to count vehicle types
  const vehicleTypeCounts = subAssets.reduce((acc: Record<string, number>, asset: any) => {
    if (asset.vehicleType) {
      acc[asset.vehicleType] = (acc[asset.vehicleType] || 0) + 1;
    }
    return acc;
  }, {});

  // Helper: Aggregate refueling history by date
  const refuelingHistoryByDate = React.useMemo(() => {
    const counts: Record<string, number> = {};
    history.forEach((record: any) => {
      // Use record.timestamp (ISO string or date string)
      const date = record.timestamp ? new Date(record.timestamp).toLocaleDateString() : 'Unknown';
      counts[date] = (counts[date] || 0) + 1;
    });
    return Object.entries(counts).map(([date, count]) => ({ date, count }));
  }, [history]);

  const renderDashboard = () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', marginTop: '4rem', marginBottom: '5rem', width: '100%' }}>
      <button
        onClick={() => setActiveView('addSubAsset')}
        style={{ height: '7rem', fontSize: '2rem', padding: '0 4rem', borderRadius: '1rem', fontWeight: 'bold', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', background: '#192133', color: '#fff', border: 'none', margin: '0 1rem' }}
      >
        Add Sub-Asset
      </button>
      <button
        onClick={() => setActiveView('viewSubAssets')}
        style={{ height: '7rem', fontSize: '2rem', padding: '0 4rem', borderRadius: '1rem', fontWeight: 'bold', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', background: '#192133', color: '#fff', border: 'none', margin: '0 1rem' }}
      >
        Sub-Asset Details
      </button>
      <button
        onClick={() => setActiveView('viewOperators')}
        style={{ height: '7rem', fontSize: '2rem', padding: '0 4rem', borderRadius: '1rem', fontWeight: 'bold', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', background: '#192133', color: '#fff', border: 'none', margin: '0 1rem' }}
      >
        Operator Details
      </button>
      <button
        onClick={() => setActiveView('refuelingHistory')}
        style={{ height: '7rem', fontSize: '2rem', padding: '0 4rem', borderRadius: '1rem', fontWeight: 'bold', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', background: '#192133', color: '#fff', border: 'none', margin: '0 1rem' }}
      >
        Refueling History
      </button>
      <button
        onClick={() => setActiveView('alerts')}
        style={{ height: '7rem', fontSize: '2rem', padding: '0 4rem', borderRadius: '1rem', fontWeight: 'bold', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', background: '#b91c1c', color: '#fff', border: 'none', margin: '0 1rem' }}
      >
        Alerts
      </button>
    </div>
  );

  const renderAddSubAsset = () => (
    <div style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 8px 32px 0 rgba(31,38,135,0.15)', padding: '2rem', maxWidth: '28rem', width: '100%', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#192133' }}>Add Sub-Asset</h2>
      </div>
      <form onSubmit={handleSubAssetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label htmlFor="vehicleNumber" style={{ color: '#192133', fontWeight: 600, marginBottom: '0.5rem', fontSize: '1rem', display: 'block' }}>Vehicle Number</label>
          <input
            id="vehicleNumber"
            value={subAssetForm.vehicleNumber}
            onChange={(e) => setSubAssetForm(prev => ({ ...prev, vehicleNumber: e.target.value }))}
            required
            style={{ border: '1px solid #22305b', borderRadius: '0.5rem', padding: '0.75rem 1rem', width: '100%', color: '#192133', background: '#fff', fontSize: '1rem', marginBottom: '1rem', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label htmlFor="vehicleType" style={{ color: '#192133', fontWeight: 600, marginBottom: '0.5rem', fontSize: '1rem', display: 'block' }}>Vehicle Type</label>
          <input
            id="vehicleType"
            value={subAssetForm.vehicleType}
            onChange={(e) => setSubAssetForm(prev => ({ ...prev, vehicleType: e.target.value }))}
            required
            style={{ border: '1px solid #22305b', borderRadius: '0.5rem', padding: '0.75rem 1rem', width: '100%', color: '#192133', background: '#fff', fontSize: '1rem', marginBottom: '1rem', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label htmlFor="tankCapacity" style={{ color: '#192133', fontWeight: 600, marginBottom: '0.5rem', fontSize: '1rem', display: 'block' }}>Tank Capacity</label>
          <input
            id="tankCapacity"
            value={subAssetForm.tankCapacity}
            onChange={(e) => setSubAssetForm(prev => ({ ...prev, tankCapacity: e.target.value }))}
            required
            style={{ border: '1px solid #22305b', borderRadius: '0.5rem', padding: '0.75rem 1rem', width: '100%', color: '#192133', background: '#fff', fontSize: '1rem', marginBottom: '1rem', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" style={{ background: '#192133', color: '#fff', fontWeight: 'bold', borderRadius: '0.5rem', padding: '0.75rem 1.5rem', border: 'none', width: '100%' }}>Add Sub-Asset</button>
          <button type="button" style={{ background: '#fff', color: '#192133', border: '1px solid #22305b', borderRadius: '0.5rem', padding: '0.75rem 1.5rem', width: '100%' }} onClick={() => setActiveView('dashboard')}>Back</button>
        </div>
      </form>
    </div>
  );

  const renderSubAssets = () => {
    // Filter subAssets by vehicleType if filter is set
    const filteredAssets = vehicleTypeFilter
      ? subAssets.filter((asset) => asset.vehicleType === vehicleTypeFilter)
      : subAssets;
    return (
      <div style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 8px 32px 0 rgba(31,38,135,0.15)', padding: '2rem', maxWidth: '40rem', width: '100%', margin: '0 auto', color: '#000' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#192133' }}>Sub-Asset Details</h2>
        </div>
        {loadingSubAssets ? (
          <div>Loading...</div>
        ) : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#000' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #ccc' }}>Vehicle Type</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #ccc' }}>Vehicle Number</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #ccc' }}>Tank Capacity</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset, index) => (
                  <tr key={index}>
                    <td style={{ padding: '0.5rem' }}>{asset.vehicleType}</td>
                    <td style={{ padding: '0.5rem' }}>{asset.vehicleNumber}</td>
                    <td style={{ padding: '0.5rem' }}>{asset.tankCapacity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Vehicle type filter buttons below the table */}
            {Object.keys(vehicleTypeCounts).length > 0 && (
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  style={{ background: vehicleTypeFilter === null ? '#e0e7ff' : '#fff', color: '#000', border: '1px solid #22305b', borderRadius: '0.5rem', padding: '0.5rem 1.2rem', fontWeight: 'bold', cursor: 'pointer' }}
                  onClick={() => setVehicleTypeFilter(null)}
                >
                  Show All
                </button>
                {Object.entries(vehicleTypeCounts).map(([type, count]) => (
                  <button
                    key={type}
                    style={{
                      background: vehicleTypeFilter === type ? '#e0e7ff' : '#fff',
                      color: '#000',
                      border: '1px solid #22305b',
                      borderRadius: '0.5rem',
                      padding: '0.5rem 1.2rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                    }}
                    onClick={() => setVehicleTypeFilter(type)}
                  >
                    {type}: {String(count)}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
        <button style={{ background: '#fff', color: '#000', border: '1px solid #22305b', borderRadius: '0.5rem', padding: '0.75rem 1.5rem', marginTop: '1rem', fontWeight: 'bold' }} onClick={() => setActiveView('dashboard')}>Back</button>
      </div>
    );
  };

  const renderOperators = () => (
    <div style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 8px 32px 0 rgba(31,38,135,0.15)', padding: '2rem', maxWidth: '40rem', width: '100%', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#192133' }}>Operator Details</h2>
      </div>
      {loadingOperators ? (
        <div>Loading...</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #ccc' }}>Operator Name</th>
              <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #ccc' }}>Phone Number</th>
              <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #ccc' }}>License Number</th>
              <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #ccc' }}>Vehicle Type</th>
              <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #ccc' }}>Vehicle Number</th>
            </tr>
          </thead>
          <tbody>
            {operators.map((operator, index) => (
              <tr key={index}>
                <td style={{ padding: '0.5rem' }}>{operator.operatorName}</td>
                <td style={{ padding: '0.5rem' }}>{operator.phoneNumber}</td>
                <td style={{ padding: '0.5rem' }}>{operator.licenseNumber}</td>
                <td style={{ padding: '0.5rem' }}>{operator.vehicleType}</td>
                <td style={{ padding: '0.5rem' }}>{operator.vehicleNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button style={{ background: '#fff', color: '#192133', border: '1px solid #22305b', borderRadius: '0.5rem', padding: '0.75rem 1.5rem', marginTop: '1rem' }} onClick={() => setActiveView('dashboard')}>Back</button>
    </div>
  );

  const renderRefuelingHistory = () => (
    <div style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 8px 32px 0 rgba(31,38,135,0.15)', padding: '2rem', maxWidth: '40rem', width: '100%', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#192133' }}>Refueling History</h2>
      </div>
      {/* Refueling History Graph */}
      <div style={{ width: '100%', height: 300, marginBottom: '2rem' }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={refuelingHistoryByDate} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#192133" strokeWidth={3} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {loadingHistory ? (
        <div>Loading...</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#000' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #ccc' }}>Timestamp</th>
              <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #ccc' }}>Vehicle Number</th>
              <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #ccc' }}>Operator Name</th>
            </tr>
          </thead>
          <tbody>
            {history.map((record, index) => (
              <tr key={index}>
                <td style={{ padding: '0.5rem' }}>{record.timestamp}</td>
                <td style={{ padding: '0.5rem' }}>{record.vehicleNumber}</td>
                <td style={{ padding: '0.5rem' }}>{record.operatorName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button style={{ background: '#fff', color: '#192133', border: '1px solid #22305b', borderRadius: '0.5rem', padding: '0.75rem 1.5rem', marginTop: '1rem' }} onClick={() => setActiveView('dashboard')}>Back</button>
    </div>
  );

  const renderAlerts = () => (
    <div style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 8px 32px 0 rgba(31,38,135,0.15)', padding: '2rem', maxWidth: '40rem', width: '100%', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#b91c1c' }}>Alerts - Unregistered Vehicles</h2>
      </div>
      {loadingAlerts ? (
        <div>Loading...</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #ccc' }}>Timestamp</th>
              <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #ccc' }}>Vehicle Number</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert, index) => (
              <tr key={index} style={{ background: '#fee2e2' }}>
                <td style={{ padding: '0.5rem' }}>{alert.timestamp}</td>
                <td style={{ padding: '0.5rem', color: '#b91c1c', fontWeight: 'bold' }}>{alert.vehicleNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button style={{ background: '#fff', color: '#192133', border: '1px solid #22305b', borderRadius: '0.5rem', padding: '0.75rem 1.5rem', marginTop: '1rem' }} onClick={() => setActiveView('dashboard')}>Back</button>
    </div>
  );

  // Dialog box for notifications
  const NotificationDialog = () => (
    dialog.open ? (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        <div style={{
          background: '#fff',
          borderRadius: '1rem',
          padding: '2rem 2.5rem',
          minWidth: '320px',
          maxWidth: '90vw',
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)',
          textAlign: 'center',
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: dialog.variant === 'error' ? '#b91c1c' : '#192133', marginBottom: '1rem' }}>{dialog.title}</h3>
          {dialog.description && <p style={{ fontSize: '1.1rem', color: '#444', marginBottom: '1.5rem' }}>{dialog.description}</p>}
          <button onClick={closeDialog} style={{ background: '#192133', color: '#fff', border: 'none', borderRadius: '0.5rem', padding: '0.75rem 1.5rem', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>OK</button>
        </div>
      </div>
    ) : null
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0e7ff 0%, #fff 50%, #e0e7ff 100%)', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {/* Logo at top left */}
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '-2rem' }}>
        <img src="/assets/logo.png" alt="Logo" style={{ height: '112px', marginLeft: '0.5rem', marginTop: '0.5rem' }} />
      </div>
      <NotificationDialog />
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '3rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#192133', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>Admin Dashboard</h1>
          <p style={{ fontSize: '1.5rem', color: '#606f7b' }}>Manage operators and sub-assets</p>
        </div>
        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'addSubAsset' && renderAddSubAsset()}
        {activeView === 'viewSubAssets' && renderSubAssets()}
        {activeView === 'viewOperators' && renderOperators()}
        {activeView === 'refuelingHistory' && renderRefuelingHistory()}
        {activeView === 'alerts' && renderAlerts()}
      </div>
      <footer style={{ width: '100%', textAlign: 'center', padding: '2rem 0', marginTop: '3rem', fontSize: '1.5rem', color: '#192133', fontWeight: 'semibold', borderTop: '1px solid #22305b', background: '#fff' }}>
        Repos Energy Pvt. Ltd. All Rights Reserved.
      </footer>
    </div>
  );
};

export default AdminDashboard;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialog, setDialog] = useState<{ open: boolean; title: string; description?: string; variant?: string }>({ open: false, title: '', description: '', variant: undefined });
  const navigate = useNavigate();

  const showDialog = (title: string, description?: string, variant?: string) => {
    setDialog({ open: true, title, description, variant });
  };
  const closeDialog = () => setDialog({ ...dialog, open: false });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      showDialog('Missing Information', 'Please fill in all required fields.', 'destructive');
      return;
    }

    setIsSubmitting(true);

    // Check credentials
    if (formData.username === 'Shubhankar' && formData.password === '12345678') {
      setTimeout(() => {
        showDialog('Login Successful!', 'Welcome to the admin dashboard.', 'success');
        setIsSubmitting(false);
        setTimeout(() => {
          setDialog({ ...dialog, open: false });
          navigate('/admin-dashboard');
        }, 1200);
      }, 800);
    } else {
      setTimeout(() => {
        showDialog('Invalid Credentials', 'Please check your username and password.', 'destructive');
        setIsSubmitting(false);
      }, 800);
    }
  };

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
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: dialog.variant === 'destructive' ? '#b91c1c' : '#192133', marginBottom: '1rem' }}>{dialog.title}</h3>
          {dialog.description && <p style={{ fontSize: '1.1rem', color: '#444', marginBottom: '1.5rem' }}>{dialog.description}</p>}
          <button onClick={closeDialog} style={{ background: '#192133', color: '#fff', border: 'none', borderRadius: '0.5rem', padding: '0.75rem 1.5rem', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>OK</button>
        </div>
      </div>
    ) : null
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0e7ff 0%, #fff 50%, #e0e7ff 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      {/* Logo at top left */}
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '-2rem' }}>
        <img src="/assets/logo.png" alt="Logo" style={{ height: '112px', marginLeft: '0.5rem', marginTop: '0.5rem' }} />
      </div>
      <NotificationDialog />
      <div style={{ width: '100%', maxWidth: '60rem', margin: '0 auto', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ marginBottom: '3rem', marginTop: '2rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#192133', marginBottom: '1rem', letterSpacing: '0.05em', textAlign: 'center' }}>Admin Login</h1>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4rem' }}>
          <div style={{ width: '100%', maxWidth: '28rem', margin: '0 auto', boxShadow: '0 8px 32px 0 rgba(31,38,135,0.15)', background: '#fff', borderRadius: '1rem', padding: '2rem', backdropFilter: 'blur(2px)' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#192133', marginBottom: '0.5rem' }}>Administrator Access</h2>
              <p style={{ fontSize: '1.125rem', color: '#666', marginBottom: '1.5rem' }}>Sign in to access the admin dashboard</p>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', alignItems: 'center' }}>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <label htmlFor="username" style={{ color: '#192133', fontWeight: 600, marginBottom: '0.5rem', fontSize: '1.25rem', display: 'block' }}>Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleInputChange}
                  style={{ border: '1px solid #22305b', borderRadius: '0.5rem', padding: '0.75rem 1rem', width: '100%', color: '#192133', background: '#fff', fontSize: '1.125rem', height: '3.5rem', marginBottom: 0, boxSizing: 'border-box' }}
                  required
                />
              </div>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <label htmlFor="password" style={{ color: '#192133', fontWeight: 600, marginBottom: '0.5rem', fontSize: '1.25rem', display: 'block' }}>Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  style={{ border: '1px solid #22305b', borderRadius: '0.5rem', padding: '0.75rem 1rem', width: '100%', color: '#192133', background: '#fff', fontSize: '1.125rem', height: '3.5rem', marginBottom: 0, boxSizing: 'border-box' }}
                  required
                />
              </div>
              <button
                type="submit"
                style={{ background: '#192133', color: '#fff', fontWeight: 'bold', borderRadius: '0.5rem', padding: '1rem', width: '100%', fontSize: '1.5rem', marginTop: '1.5rem', border: 'none' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing In...' : 'LOGIN'}
              </button>
            </form>
          </div>
        </div>
        <div style={{ color: '#666', fontSize: '1.125rem', marginTop: '1rem' }}>
          <p>Need to register as an operator? <a href="/" style={{ color: '#2563eb', fontWeight: 500, textDecoration: 'underline' }}>Sign up here</a></p>
        </div>
      </div>
      <footer style={{ width: '100%', textAlign: 'center', padding: '2rem 0', marginTop: '3rem', fontSize: '1.25rem', color: '#192133', fontWeight: 600, borderTop: '1px solid #22305b20', background: '#fff' }}>
        Repos Energy Pvt. Ltd. All Rights Reserved.
      </footer>
    </div>
  );
};

export default AdminLogin;

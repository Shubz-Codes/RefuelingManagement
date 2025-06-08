import SignupForm from '@/components/SignupForm';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0e7ff 0%, #fff 50%, #e0e7ff 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '1rem' }}>
      {/* Logo at top left */}
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '-2rem' }}>
        <img src="/assets/logo.png" alt="Logo" style={{ height: '112px', marginLeft: '0.5rem', marginTop: '0.5rem' }} />
      </div>
      <div style={{ width: '100%', maxWidth: '60rem', margin: '0 auto', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ marginBottom: '4rem', marginTop: '3rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#192133', marginBottom: '1.5rem' }}>Operator Sign-up</h1>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4rem' }}>
          <SignupForm />
        </div>
        <div style={{ color: '#22305b', fontSize: '1.25rem', marginTop: '1rem' }}>
          <p>Administrator? <Link to="/admin-login" style={{ color: '#22305b', fontWeight: 500, textDecoration: 'underline' }}>Admin Login</Link></p>
        </div>
      </div>
      <footer style={{ width: '100%', textAlign: 'center', padding: '2rem 0', marginTop: '3rem', fontSize: '1.5rem', color: '#192133', fontWeight: 600, borderTop: '1px solid #22305b20', background: '#fff' }}>
        Repos Energy Pvt. Ltd. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Index;

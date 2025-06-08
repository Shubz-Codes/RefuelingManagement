import React, { useState } from 'react';
import { dataService } from '@/services/dataService';
import { User, Phone, CreditCard, Truck, Hash } from 'lucide-react';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    operatorName: '',
    phoneNumber: '',
    licenseNumber: '',
    vehicleType: '',
    vehicleNumber: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialog, setDialog] = useState<{ open: boolean; title: string; description?: string; variant?: string }>({ open: false, title: '', description: '', variant: undefined });

  const showDialog = (title: string, description?: string, variant?: string) => {
    setDialog({ open: true, title, description, variant });
  };
  const closeDialog = () => setDialog({ ...dialog, open: false });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.operatorName || !formData.phoneNumber || !formData.licenseNumber || !formData.vehicleType || !formData.vehicleNumber) {
      showDialog('Missing Information', 'Please fill in all required fields.', 'destructive');
      return;
    }
    setIsSubmitting(true);
    const operatorData = {
      name: formData.operatorName,
      phone: formData.phoneNumber,
      license: formData.licenseNumber,
      vehicleNo: formData.vehicleNumber
    };
    await dataService.addOperatorDetails(operatorData);
    setTimeout(() => {
      showDialog('Registration Successful!', 'You have been registered as an operator.', 'success');
      setFormData({
        operatorName: '',
        phoneNumber: '',
        licenseNumber: '',
        vehicleType: '',
        vehicleNumber: ''
      });
      setIsSubmitting(false);
    }, 1200);
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
    <div style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 8px 32px 0 rgba(31,38,135,0.15)', padding: '2rem', maxWidth: '28rem', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <NotificationDialog />
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#192133', marginBottom: '0.5rem' }}>Sign Up as Operator</h2>
        <p style={{ fontSize: '1.125rem', color: '#666' }}>Join our network</p>
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', alignItems: 'center' }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label htmlFor="operatorName" style={{ color: '#192133', fontWeight: 600, marginBottom: '0.5rem', fontSize: '1.25rem', display: 'block' }}>Operator Name</label>
          <input
            id="operatorName"
            name="operatorName"
            value={formData.operatorName}
            onChange={handleInputChange}
            style={{ border: '1px solid #22305b', borderRadius: '0.5rem', padding: '0.75rem 1rem', width: '100%', color: '#192133', background: '#fff', fontSize: '1.125rem', height: '3.5rem', marginBottom: 0, boxSizing: 'border-box' }}
            required
          />
        </div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label htmlFor="phoneNumber" style={{ color: '#192133', fontWeight: 600, marginBottom: '0.5rem', fontSize: '1.25rem', display: 'block' }}>Phone Number</label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            style={{ border: '1px solid #22305b', borderRadius: '0.5rem', padding: '0.75rem 1rem', width: '100%', color: '#192133', background: '#fff', fontSize: '1.125rem', height: '3.5rem', marginBottom: 0, boxSizing: 'border-box' }}
            required
          />
        </div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label htmlFor="licenseNumber" style={{ color: '#192133', fontWeight: 600, marginBottom: '0.5rem', fontSize: '1.25rem', display: 'block' }}>License Number</label>
          <input
            id="licenseNumber"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleInputChange}
            style={{ border: '1px solid #22305b', borderRadius: '0.5rem', padding: '0.75rem 1rem', width: '100%', color: '#192133', background: '#fff', fontSize: '1.125rem', height: '3.5rem', marginBottom: 0, boxSizing: 'border-box' }}
            required
          />
        </div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label htmlFor="vehicleType" style={{ color: '#192133', fontWeight: 600, marginBottom: '0.5rem', fontSize: '1.25rem', display: 'block' }}>Vehicle Type</label>
          <input
            id="vehicleType"
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleInputChange}
            style={{ border: '1px solid #22305b', borderRadius: '0.5rem', padding: '0.75rem 1rem', width: '100%', color: '#192133', background: '#fff', fontSize: '1.125rem', height: '3.5rem', marginBottom: 0, boxSizing: 'border-box' }}
            required
          />
        </div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label htmlFor="vehicleNumber" style={{ color: '#192133', fontWeight: 600, marginBottom: '0.5rem', fontSize: '1.25rem', display: 'block' }}>Vehicle Number</label>
          <input
            id="vehicleNumber"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleInputChange}
            style={{ border: '1px solid #22305b', borderRadius: '0.5rem', padding: '0.75rem 1rem', width: '100%', color: '#192133', background: '#fff', fontSize: '1.125rem', height: '3.5rem', marginBottom: 0, boxSizing: 'border-box' }}
            required
          />
        </div>
        <button type="submit" style={{ background: '#192133', color: '#fff', fontWeight: 'bold', borderRadius: '0.5rem', padding: '1rem', width: '100%', fontSize: '1.5rem', marginTop: '1.5rem', border: 'none' }} disabled={isSubmitting}>
          {isSubmitting ? 'Signing Up...' : 'SIGN UP'}
        </button>
      </form>
    </div>
  );
};

export default SignupForm;

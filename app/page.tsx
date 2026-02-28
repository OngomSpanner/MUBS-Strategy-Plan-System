"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate authentication check
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Basic role-based routing simulation based on email
      if (email.includes('admin')) {
        router.push('/admin');
      } else if (email.includes('staff')) {
        router.push('/staff');
      } else if (email.includes('committee')) {
        router.push('/committee');
      } else if (email.includes('unit')) {
        router.push('/unit-head');
      } else if (email.includes('principal')) {
        router.push('/principal');
      } else {
        router.push('/admin'); // Default fallback
      }
    } catch (err) {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #005696 0%, #102a43 100%)', // Brand blue background
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Brand Colors Background Elements */}
      <div style={{
        position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px',
        background: '#e31837', // brand red
        borderRadius: '50%', filter: 'blur(100px)', opacity: '0.4'
      }}></div>
      <div style={{
        position: 'absolute', bottom: '-10%', left: '-5%', width: '400px', height: '400px',
        background: '#ffcd00', // brand yellow
        borderRadius: '50%', filter: 'blur(100px)', opacity: '0.3'
      }}></div>

      <div
        className="card shadow-lg border-0"
        style={{
          maxWidth: '440px',
          width: '90%',
          padding: '2.5rem 2rem',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          zIndex: 1,
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
        }}
      >
        <div className="text-center mb-4">
          <div className="mb-3 d-flex justify-content-center">
            <Image
              src="/logo.png"
              alt="MUBS Logo"
              width={100}
              height={100}
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          <h4 className="fw-bold mb-1" style={{ color: '#005696' }}>Strategy Plan System</h4>
          <p className="text-muted small mb-0">Sign in to access your dashboard</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-4" style={{ borderLeft: '4px solid #e31837' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#e31837' }}>error</span>
            <span className="fw-medium text-dark">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ borderRadius: '10px', border: '1px solid #ced4da' }}
            />
            <label htmlFor="email" className="text-muted">Email address</label>
          </div>
          <div className="form-floating mb-4">
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ borderRadius: '10px', border: '1px solid #ced4da' }}
            />
            <label htmlFor="password" className="text-muted">Password</label>
          </div>

          <button
            type="submit"
            className="btn w-100 py-2 fw-bold text-white d-flex align-items-center justify-content-center gap-2 position-relative overflow-hidden"
            disabled={loading}
            style={{
              borderRadius: '10px',
              background: 'linear-gradient(90deg, #005696 0%, #007ac3 100%)', // Brand blue gradient
              border: 'none',
              height: '52px',
              transition: 'transform 0.2s',
              boxShadow: '0 4px 12px rgba(0,86,150,0.3)'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              <>
                Sign In <span className="material-symbols-outlined ms-1" style={{ fontSize: '20px' }}>login</span>
              </>
            )}

            {/* Subtle Brand Strip on Button */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', display: 'flex' }}>
              <div style={{ flex: 1, background: '#e31837' /* Red */ }}></div>
              <div style={{ flex: 1, background: '#ffcd00' /* Yellow */ }}></div>
              <div style={{ flex: 1, background: '#005696' /* Blue */ }}></div>
            </div>
          </button>
        </form>

        <div className="text-center mt-5">
          {/* Subtle line with brand colors */}
          <div className="mx-auto mb-3" style={{ height: '3px', width: '50px', display: 'flex', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ flex: 1, background: '#e31837' }}></div>
            <div style={{ flex: 1, background: '#ffcd00' }}></div>
            <div style={{ flex: 1, background: '#005696' }}></div>
          </div>
          <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
            &copy; {new Date().getFullYear()} Makerere University Business School.
          </small>
        </div>
      </div>
    </div>
  );
}
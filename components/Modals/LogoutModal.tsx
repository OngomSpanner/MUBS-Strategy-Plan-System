"use client";

import { Modal, Button } from 'react-bootstrap';

interface LogoutModalProps {
  show: boolean;
  onHide: () => void;
}

export default function LogoutModal({ show, onHide }: LogoutModalProps) {
  const handleLogout = () => {
    // Implement logout logic here
    window.location.href = '/login';
  };

  return (
    <Modal show={show} onHide={onHide} centered size="sm">
      <Modal.Body className="p-4 text-center">
        <div className="mb-3" style={{ fontSize: '3rem' }}>👋</div>
        <h5 className="fw-black text-dark mb-2">Logout?</h5>
        <p className="text-muted small mb-0">Are you sure you want to end your current session?</p>
      </Modal.Body>
      <Modal.Footer className="justify-content-center border-0 pt-0">
        <Button variant="light" className="px-4" onClick={onHide}>
          Stay
        </Button>
        <Button
          className="fw-bold px-4 text-white"
          style={{ background: 'var(--mubs-red)', borderColor: 'var(--mubs-red)' }}
          onClick={handleLogout}
        >
          Yes, Logout
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
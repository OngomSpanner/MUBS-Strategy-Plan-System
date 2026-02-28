"use client";

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

interface Proposal {
  id: number;
  title: string;
  submitted_by: string;
  unit: string;
  submitted_date: string;
  budget: number;
  status: string;
  description?: string;
}

export default function CommitteePage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [editNote, setEditNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Modal visibility
  const [showView, setShowView] = useState(false);
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  // Derived stats from real data
  const stats = {
    pending: proposals.filter(p => p.status === 'Pending').length,
    approved: proposals.filter(p => p.status === 'Approved').length,
    rejected: proposals.filter(p => p.status === 'Rejected').length,
    edits: proposals.filter(p => p.status === 'Edit Requested').length,
  };

  const filteredProposals = statusFilter === 'All Statuses'
    ? proposals
    : proposals.filter(p => p.status === statusFilter);

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil(filteredProposals.length / PAGE_SIZE));
  const paginatedProposals = filteredProposals.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Reset to page 1 when filter changes
  useEffect(() => { setCurrentPage(1); }, [statusFilter]);

  useEffect(() => { fetchProposals(); }, []);

  const fetchProposals = async () => {
    try {
      const response = await axios.get('/api/committees');
      setProposals(response.data);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  const open = (modal: 'view' | 'approve' | 'reject' | 'edit', proposal: Proposal) => {
    setSelectedProposal(proposal);
    setEditNote('');
    if (modal === 'view') setShowView(true);
    if (modal === 'approve') setShowApprove(true);
    if (modal === 'reject') setShowReject(true);
    if (modal === 'edit') setShowEdit(true);
  };

  const closeAll = () => {
    setShowView(false);
    setShowApprove(false);
    setShowReject(false);
    setShowEdit(false);
    setSelectedProposal(null);
    setEditNote('');
  };

  const handleStatusChange = async (status: string, reviewer_notes?: string) => {
    if (!selectedProposal) return;
    setActionLoading(true);
    try {
      await axios.patch(`/api/committees/${selectedProposal.id}`, { status, reviewer_notes });
      closeAll();
      fetchProposals();
    } catch (error) {
      console.error('Error updating proposal:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: { [key: string]: { bg: string; color: string } } = {
      'Pending': { bg: '#fef9c3', color: '#a16207' },
      'Approved': { bg: '#dcfce7', color: '#15803d' },
      'Rejected': { bg: '#fee2e2', color: '#b91c1c' },
      'Edit Requested': { bg: '#fde8d8', color: '#c2410c' }
    };
    return styles[status] || { bg: '#f1f5f9', color: '#475569' };
  };

  const getIcon = (title: string) =>
    title.includes('eCampus') ? 'devices' :
      title.includes('Forum') ? 'event' :
        title.includes('Curriculum') ? 'menu_book' : 'groups_2';

  return (
    <Layout>
      {/* Stat Cards */}
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div className="stat-card" style={{ borderLeftColor: 'var(--mubs-yellow)' }}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="stat-icon" style={{ background: '#fffbeb' }}>
                <span className="material-symbols-outlined" style={{ color: '#b45309' }}>pending_actions</span>
              </div>
              <span className="stat-badge" style={{ background: '#fffbeb', color: '#b45309' }}>Review</span>
            </div>
            <div className="stat-label">Pending Review</div>
            <div className="stat-value">{stats.pending}</div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="stat-icon" style={{ background: '#ecfdf5' }}>
                <span className="material-symbols-outlined" style={{ color: '#059669' }}>thumb_up</span>
              </div>
              <span className="stat-badge" style={{ background: '#ecfdf5', color: '#059669' }}>Approved</span>
            </div>
            <div className="stat-label">Approved</div>
            <div className="stat-value">{stats.approved}</div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="stat-card" style={{ borderLeftColor: 'var(--mubs-red)' }}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="stat-icon" style={{ background: '#fff1f2' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--mubs-red)' }}>thumb_down</span>
              </div>
              <span className="stat-badge" style={{ background: '#fff1f2', color: 'var(--mubs-red)' }}>Rejected</span>
            </div>
            <div className="stat-label">Rejected</div>
            <div className="stat-value">{stats.rejected}</div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="stat-card" style={{ borderLeftColor: 'var(--mubs-blue)' }}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="stat-icon" style={{ background: '#eff6ff' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--mubs-blue)' }}>rate_review</span>
              </div>
              <span className="stat-badge" style={{ background: '#eff6ff', color: 'var(--mubs-blue)' }}>Edits</span>
            </div>
            <div className="stat-label">Edit Requested</div>
            <div className="stat-value">{stats.edits}</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <div className="table-card-header">
          <h5>
            <span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>groups</span>
            Committee Proposals
          </h5>
          <div className="d-flex gap-2 flex-wrap">
            <select
              className="form-select form-select-sm"
              style={{ width: '150px' }}
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option>All Statuses</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
              <option>Edit Requested</option>
            </select>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table mb-0">
            <thead>
              <tr>
                <th>Proposal</th>
                <th>Submitted By</th>
                <th>Unit</th>
                <th>Date</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProposals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-muted">No proposals found</td>
                </tr>
              ) : (
                paginatedProposals.map((proposal) => {
                  const statusStyle = getStatusBadge(proposal.status);
                  return (
                    <tr key={proposal.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="activity-icon">
                            <span className="material-symbols-outlined">{getIcon(proposal.title)}</span>
                          </div>
                          <div>
                            <div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>{proposal.title}</div>
                            <div className="text-muted" style={{ fontSize: '.72rem' }}>Budget: UGX {proposal.budget}M</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '.83rem' }}>{proposal.submitted_by}</td>
                      <td style={{ fontSize: '.83rem' }}>{proposal.unit}</td>
                      <td style={{ fontSize: '.83rem' }}>{proposal.submitted_date}</td>
                      <td style={{ fontSize: '.83rem' }}>UGX {proposal.budget}M</td>
                      <td>
                        <span className="status-badge" style={{ background: statusStyle.bg, color: statusStyle.color }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>circle</span>
                          {proposal.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          {/* View — always visible */}
                          <button
                            className="btn btn-xs py-0 px-2 btn-outline-primary fw-bold"
                            style={{ fontSize: '.75rem' }}
                            title="View Proposal"
                            onClick={() => open('view', proposal)}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>visibility</span>
                          </button>

                          {/* Pending-only actions */}
                          {proposal.status === 'Pending' && (
                            <>
                              <button
                                className="btn btn-xs py-0 px-2 btn-success fw-bold"
                                style={{ fontSize: '.75rem' }}
                                title="Approve"
                                onClick={() => open('approve', proposal)}
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>thumb_up</span>
                              </button>
                              <button
                                className="btn btn-xs py-0 px-2 btn-warning fw-bold text-dark"
                                style={{ fontSize: '.75rem' }}
                                title="Request Edit"
                                onClick={() => open('edit', proposal)}
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>edit_note</span>
                              </button>
                              <button
                                className="btn btn-xs py-0 px-2 btn-danger fw-bold"
                                style={{ fontSize: '.75rem' }}
                                title="Reject"
                                onClick={() => open('reject', proposal)}
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>thumb_down</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="table-card-footer">
          <span className="footer-label">
            Showing {filteredProposals.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredProposals.length)} of {filteredProposals.length} proposals
          </span>
          <div className="d-flex gap-1">
            <button
              className="page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`page-btn ${page === currentPage ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >{page}</button>
            ))}
            <button
              className="page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >›</button>
          </div>
        </div>
      </div>

      {/* ── VIEW MODAL ── */}
      <Modal show={showView} onHide={closeAll} centered size="lg">
        <Modal.Header closeButton className="modal-header-mubs">
          <Modal.Title className="fw-bold d-flex align-items-center gap-2">
            <span className="material-symbols-outlined">description</span>
            Proposal Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProposal && (
            <div className="row g-3">
              <div className="col-12">
                <div className="p-3 rounded" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div className="fw-bold fs-6 mb-1">{selectedProposal.title}</div>
                  <span
                    className="status-badge"
                    style={{ background: getStatusBadge(selectedProposal.status).bg, color: getStatusBadge(selectedProposal.status).color }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>circle</span>
                    {selectedProposal.status}
                  </span>
                </div>
              </div>
              <div className="col-md-4">
                <div className="small text-muted fw-bold">Submitted By</div>
                <div className="fw-bold text-dark">{selectedProposal.submitted_by}</div>
              </div>
              <div className="col-md-4">
                <div className="small text-muted fw-bold">Unit / Department</div>
                <div className="fw-bold text-dark">{selectedProposal.unit}</div>
              </div>
              <div className="col-md-4">
                <div className="small text-muted fw-bold">Submitted Date</div>
                <div className="fw-bold text-dark">{selectedProposal.submitted_date}</div>
              </div>
              <div className="col-12">
                <div className="small text-muted fw-bold">Requested Budget</div>
                <div className="fw-bold text-dark fs-5" style={{ color: 'var(--mubs-blue)' }}>
                  UGX {selectedProposal.budget}M
                </div>
              </div>
              {selectedProposal.description && (
                <div className="col-12">
                  <div className="small text-muted fw-bold mb-1">Description</div>
                  <p className="text-dark small" style={{ lineHeight: '1.6' }}>{selectedProposal.description}</p>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={closeAll}>Close</Button>
          {selectedProposal?.status === 'Pending' && (
            <>
              <Button variant="success" className="fw-bold" onClick={() => { setShowView(false); setShowApprove(true); }}>
                <span className="material-symbols-outlined me-1" style={{ fontSize: '16px' }}>thumb_up</span>
                Approve
              </Button>
              <Button variant="danger" className="fw-bold" onClick={() => { setShowView(false); setShowReject(true); }}>
                <span className="material-symbols-outlined me-1" style={{ fontSize: '16px' }}>thumb_down</span>
                Reject
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      {/* ── APPROVE CONFIRM MODAL ── */}
      <Modal show={showApprove} onHide={closeAll} centered size="sm">
        <Modal.Body className="p-4 text-center">
          <div className="mb-3" style={{ fontSize: '3rem' }}>✅</div>
          <h5 className="fw-bold text-dark mb-2">Approve Proposal?</h5>
          <p className="text-muted small mb-0">
            You are about to approve <strong>{selectedProposal?.title}</strong>. This action will be recorded.
          </p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center border-0 pt-0">
          <Button variant="light" className="px-4" onClick={closeAll} disabled={actionLoading}>Cancel</Button>
          <Button
            variant="success"
            className="fw-bold px-4"
            disabled={actionLoading}
            onClick={() => handleStatusChange('Approved')}
          >
            {actionLoading ? 'Saving...' : 'Yes, Approve'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ── REJECT CONFIRM MODAL ── */}
      <Modal show={showReject} onHide={closeAll} centered size="sm">
        <Modal.Body className="p-4 text-center">
          <div className="mb-3" style={{ fontSize: '3rem' }}>❌</div>
          <h5 className="fw-bold text-dark mb-2">Reject Proposal?</h5>
          <p className="text-muted small mb-0">
            You are about to reject <strong>{selectedProposal?.title}</strong>. This action will be recorded.
          </p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center border-0 pt-0">
          <Button variant="light" className="px-4" onClick={closeAll} disabled={actionLoading}>Cancel</Button>
          <Button
            style={{ background: 'var(--mubs-red)', borderColor: 'var(--mubs-red)' }}
            className="fw-bold px-4 text-white"
            disabled={actionLoading}
            onClick={() => handleStatusChange('Rejected')}
          >
            {actionLoading ? 'Saving...' : 'Yes, Reject'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ── REQUEST EDIT MODAL ── */}
      <Modal show={showEdit} onHide={closeAll} centered>
        <Modal.Header closeButton className="modal-header-mubs">
          <Modal.Title className="fw-bold d-flex align-items-center gap-2">
            <span className="material-symbols-outlined">edit_note</span>
            Request Edit
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted small mb-3">
            Describe what changes are needed for <strong>{selectedProposal?.title}</strong>. The submitter will be notified.
          </p>
          <Form.Label className="fw-bold small">Edit Notes / Feedback <span className="text-danger">*</span></Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="e.g. Please revise the budget breakdown and include a timeline..."
            value={editNote}
            onChange={(e) => setEditNote(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={closeAll} disabled={actionLoading}>Cancel</Button>
          <Button
            style={{ background: 'var(--mubs-yellow)', borderColor: 'var(--mubs-yellow)' }}
            className="fw-bold text-dark"
            disabled={actionLoading || !editNote.trim()}
            onClick={() => handleStatusChange('Edit Requested', editNote.trim())}
          >
            <span className="material-symbols-outlined me-1" style={{ fontSize: '16px' }}>send</span>
            {actionLoading ? 'Sending...' : 'Send Feedback'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
}
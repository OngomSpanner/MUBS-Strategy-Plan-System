"use client";

import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";

interface Task {
  id: number;
  title: string;
  description?: string;
  startDate?: string;
  dueDate?: string;
  status?: string;
  task_type?: 'process' | 'kpi_driver';
  kpi_target_value?: number | null;
}

interface TaskSubmissionModalProps {
  show: boolean;
  onHide: () => void;
  task: Task | null;
  onSuccess?: () => void;
}

export default function TaskSubmissionModal({ show, onHide, task, onSuccess }: TaskSubmissionModalProps) {
  const [description, setDescription] = useState("");
  const [evidenceLink, setEvidenceLink] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [existingAttachments, setExistingAttachments] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [kpiActualValue, setKpiActualValue] = useState<string>("");

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Under Review' || status === 'submitted') return <span className="status-badge" style={{ background: '#eff6ff', color: 'var(--mubs-blue)', fontSize: '0.65rem' }}>Under Review</span>;
    if (status === 'Completed' || status === 'evaluated') return <span className="status-badge" style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.65rem' }}>Complete</span>;
    if (status === 'Returned' || status === 'draft') return <span className="status-badge" style={{ background: '#fee2e2', color: '#b91c1c', fontSize: '0.65rem' }}>Returned</span>;
    return <span className="status-badge bg-light text-dark" style={{ fontSize: '0.65rem' }}>{status}</span>;
  };

  const [submission, setSubmission] = useState<any>(null);

  React.useEffect(() => {
    if (show && task) {
      setDescription("");
      setEvidenceLink("");
      setAttachedFile(null);
      setExistingAttachments([]);
      setSubmission(null);
      setKpiActualValue("");
      
      const fetchSubmission = async () => {
        setFetching(true);
        try {
          const res = await axios.get("/api/staff/submissions");
          const allSubmissions = res.data.submissions || [];
          const found = allSubmissions.find((s: any) => s.task_id === task.id);
          
          if (found) {
            setSubmission(found);
            setDescription(found.description || "");
            setKpiActualValue(found.kpi_actual_value != null ? found.kpi_actual_value.toString() : "");
            
            if (found.attachments) {
              const parts = found.attachments.split(" | ");
              const files: string[] = [];
              let foundLink = "";
              
              parts.forEach((p: string) => {
                if (p.startsWith("http")) foundLink = p;
                else if (p.startsWith("/uploads/")) files.push(p);
              });
              setExistingAttachments(files);
              setEvidenceLink(foundLink);
            }
          }
        } catch (err) {
          console.error("Error fetching submission:", err);
        } finally {
          setFetching(false);
        }
      };

      if (task.status === "In Progress" || task.status === "Returned" || task.status === "Incomplete") {
          fetchSubmission();
      }
    }
  }, [show, task]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        alert("File too large. Max 10MB.");
        return;
      }
      setAttachedFile(file);
    }
  };

  const handleSubmit = async (isDraft: boolean) => {
    if (!task) return;
    if (!isDraft && !description) {
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("taskId", task.id.toString());
      formData.append("description", description);
      formData.append("evidenceLink", evidenceLink);
      formData.append("isDraft", isDraft ? "true" : "false");
      formData.append("kpiActualValue", kpiActualValue);
      if (attachedFile) {
        formData.append("file", attachedFile);
      }

      await axios.post("/api/staff/submissions", formData);
      // alert(isDraft ? "Draft saved successfully!" : "Report submitted successfully!");
      
      onHide();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={() => !submitting && onHide()} centered backdrop="static" keyboard={false} size="lg">
      <Modal.Header closeButton style={{ background: 'linear-gradient(90deg,#eff6ff,#fff)', borderBottom: '1px solid #e2e8f0', padding: '0.75rem 1rem' }}>
        <Modal.Title className="fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: '1.05rem' }}>
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '22px' }}>upload_file</span>
          Submit Task Report
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-3">
        {fetching ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary me-2"></div>
            <div className="text-muted" style={{ fontSize: '0.9rem' }}>Loading report details...</div>
          </div>
        ) : (
          <div className="row g-3">
            {/* Task Overview / Instructions */}
            {task && (
                <div className="col-12">
                    <div className="p-3 rounded-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '4px solid var(--mubs-blue)' }}>
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>info</span>
                            <span className="fw-bold text-dark small">Task Instructions & Overview</span>
                        </div>
                        <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>{task.title}</h6>
                        <div className="text-muted mb-3" style={{ fontSize: '0.82rem', lineHeight: '1.4' }}>
                            {task.description || "No specific instructions provided."}
                        </div>
                        <div className="d-flex gap-4 flex-wrap">
                            <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '0.75rem' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>calendar_today</span>
                                <span className="fw-bold">Start:</span> {task.startDate ? new Date(task.startDate).toLocaleDateString() : 'N/A'}
                            </div>
                            <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '0.75rem' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>event_available</span>
                                <span className="fw-bold">Deadline:</span> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="col-12">
              <label className="form-label fw-bold text-dark small">
                Report Details <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control"
                rows={5}
                placeholder="Describe what was done, what remains, any challenges encountered..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={submitting}
              ></textarea>
            </div>

            {task?.task_type === 'kpi_driver' && (
              <div className="col-12">
                <label className="form-label fw-bold text-dark small mb-1">
                  KPI Value
                </label>
                <input
                  type="text"
                  className="form-control shadow-sm"
                  placeholder="Enter achieved value..."
                  value={kpiActualValue}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || /^-?\d*\.?\d*$/.test(val)) {
                      setKpiActualValue(val);
                    }
                  }}
                  disabled={submitting}
                />
              </div>
            )}

            <div className="col-12">
              <label className="form-label fw-bold text-dark small d-flex align-items-center gap-2">
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--mubs-blue)' }}>attach_file</span>
                Attach Supporting File
              </label>
              {existingAttachments.length > 0 && (
                  <div className="mb-2 p-2 border rounded-2 bg-light d-flex align-items-center gap-2">
                      <span className="material-symbols-outlined text-success" style={{ fontSize: '18px' }}>check_circle</span>
                      <span className="small text-muted">A file is already attached. Uploading a new one will replace it.</span>
                  </div>
              )}
              <input
                type="file"
                className="form-control"
                onChange={handleFileChange}
                disabled={submitting}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
              />
              <small className="text-muted">PDF, DOCX, XLSX, PNG, JPG (Max 10MB)</small>
            </div>

            <div className="col-12">
              <label className="form-label fw-bold text-dark small d-flex align-items-center gap-2">
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--mubs-blue)' }}>link</span>
                Download link (Google Drive, SharePoint, etc.)
              </label>
              <input
                type="url"
                className="form-control"
                placeholder="https://drive.google.com/..."
                value={evidenceLink}
                onChange={(e) => setEvidenceLink(e.target.value)}
                disabled={submitting}
              />
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="border-0 bg-light p-3 d-flex justify-content-end">
        <Button style={{ background: 'var(--mubs-blue)', borderColor: 'var(--mubs-blue)', borderRadius: '8px' }} className="fw-bold text-white px-4" onClick={() => handleSubmit(false)} disabled={submitting}>
          {submitting ? 'Submitting...' : (task?.status === 'Returned' || task?.status === 'Incomplete' ? 'Resubmit' : 'Submit for Review')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

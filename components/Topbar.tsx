"use client";

interface TopbarProps {
  pageTitle: string;
  toggleSidebar: () => void;
}

export default function Topbar({ pageTitle, toggleSidebar }: TopbarProps) {

  return (
    <header className="topbar">
      <div className="d-flex align-items-center gap-3">
        <button
          className="d-lg-none btn btn-sm text-white p-1"
          style={{ background: 'rgba(255,255,255,.1)', borderRadius: '8px' }}
          onClick={toggleSidebar}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <nav className="breadcrumb-nav d-flex align-items-center text-white-50">
          <span>Home</span>
          <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#93c5fd', margin: '0 .3rem' }}>
            chevron_right
          </span>
          <span className="text-white fw-bold" id="breadcrumbLabel">{pageTitle}</span>
        </nav>
      </div>

      <div className="d-flex align-items-center gap-3">

        <div className="notif-btn" data-bs-toggle="dropdown" role="button">
          <span className="material-symbols-outlined text-white" style={{ fontSize: '22px' }}>notifications</span>
          <span className="notif-dot"></span>
        </div>

        <ul className="dropdown-menu dropdown-menu-end shadow-lg" style={{ minWidth: '300px' }}>
          <li><h6 className="dropdown-header fw-bold text-dark">Notifications</h6></li>
          <li>
            <a className="dropdown-item py-2" href="#">
              <div className="d-flex gap-2 align-items-start">
                <span className="material-symbols-outlined text-danger mt-1" style={{ fontSize: '18px' }}>warning</span>
                <div>
                  <div className="fw-bold small">Deadline Alert</div>
                  <div className="text-muted" style={{ fontSize: '.75rem' }}>Research Modernization is delayed by 3 weeks</div>
                </div>
              </div>
            </a>
          </li>
          <li>
            <a className="dropdown-item py-2" href="#">
              <div className="d-flex gap-2 align-items-start">
                <span className="material-symbols-outlined text-success mt-1" style={{ fontSize: '18px' }}>check_circle</span>
                <div>
                  <div className="fw-bold small">User Created</div>
                  <div className="text-muted" style={{ fontSize: '.75rem' }}>New staff account activated: B. Nakato</div>
                </div>
              </div>
            </a>
          </li>
          <li><hr className="dropdown-divider" /></li>
          <li><a className="dropdown-item text-center small fw-bold" href="#">View all notifications</a></li>
        </ul>

        <div className="vr bg-white-50 mx-1 d-none d-sm-block" style={{ opacity: '.2', height: '28px' }}></div>

        <button className="avatar-btn" data-bs-toggle="dropdown">
          <div className="text-end d-none d-sm-block">
            <div className="text-white fw-bold" style={{ fontSize: '.8rem', lineHeight: '1.1' }}>Admin John</div>
            <div className="text-white-50" style={{ fontSize: '.68rem' }}>Super Administrator</div>
          </div>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--mubs-yellow)',
            border: '2px solid var(--mubs-yellow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--mubs-navy)', fontSize: '20px' }}>person</span>
          </div>
        </button>

        <ul className="dropdown-menu dropdown-menu-end shadow">
          <li><h6 className="dropdown-header text-muted small">Signed in as</h6></li>
          <li><span className="dropdown-item-text fw-bold text-dark">Admin John</span></li>
          <li><hr className="dropdown-divider" /></li>
          <li><a className="dropdown-item" href="#">
            <span className="material-symbols-outlined me-1" style={{ fontSize: '18px' }}>person</span>My Profile
          </a></li>
          <li><a className="dropdown-item" href="#">
            <span className="material-symbols-outlined me-1" style={{ fontSize: '18px' }}>settings</span>Account Settings
          </a></li>
          <li><hr className="dropdown-divider" /></li>
          <li>
            <a className="dropdown-item text-danger" href="#" data-bs-toggle="modal" data-bs-target="#logoutModal">
              <span className="material-symbols-outlined me-1" style={{ fontSize: '18px' }}>logout</span>Logout
            </a>
          </li>
        </ul>

      </div>
    </header>
  );
}
interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  badge: string;
  badgeIcon: string;
  color: 'blue' | 'yellow' | 'green' | 'red';
}

export default function StatCard({ icon, label, value, badge, badgeIcon, color }: StatCardProps) {
  const colorStyles = {
    blue: {
      borderLeft: 'var(--mubs-blue)',
      iconBg: '#eff6ff',
      iconColor: 'var(--mubs-blue)',
      badgeBg: '#eff6ff',
      badgeColor: 'var(--mubs-blue)'
    },
    yellow: {
      borderLeft: 'var(--mubs-yellow)',
      iconBg: '#fffbeb',
      iconColor: '#b45309',
      badgeBg: '#fffbeb',
      badgeColor: '#b45309'
    },
    green: {
      borderLeft: '#10b981',
      iconBg: '#ecfdf5',
      iconColor: '#059669',
      badgeBg: '#ecfdf5',
      badgeColor: '#059669'
    },
    red: {
      borderLeft: 'var(--mubs-red)',
      iconBg: '#fff1f2',
      iconColor: 'var(--mubs-red)',
      badgeBg: '#fff1f2',
      badgeColor: 'var(--mubs-red)'
    }
  };

  const style = colorStyles[color];

  return (
    <div className="stat-card" style={{ borderLeftColor: style.borderLeft }}>
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className="stat-icon" style={{ background: style.iconBg }}>
          <span className="material-symbols-outlined" style={{ color: style.iconColor }}>{icon}</span>
        </div>
        <span className="stat-badge" style={{ background: style.badgeBg, color: style.badgeColor }}>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{badgeIcon}</span>
          {badge}
        </span>
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}
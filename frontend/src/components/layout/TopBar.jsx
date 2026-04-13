import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const titles = {
  '/dashboard': 'Dashboard',
  '/research': 'New Research',
  '/history': 'History',
  '/admin': 'Admin',
};

export default function TopBar() {
  const location = useLocation();
  const { org } = useAuth();

  const path = location.pathname;
  const isResearchDetail = path.startsWith('/research/') && path !== '/research';
  const title = isResearchDetail ? 'Research Report' : titles[path] || '';

  return (
    <div className="h-12 border-b border-border flex items-center justify-between px-6 shrink-0">
      <h2 className="text-[13px] font-medium text-text-primary">
        {title}
      </h2>
      {org && (
        <span className="text-[12px] text-text-secondary">
          {org.name}
        </span>
      )}
    </div>
  );
}

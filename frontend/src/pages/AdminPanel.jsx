import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Copy, Check, RefreshCw } from 'lucide-react';

export default function AdminPanel() {
  const { user, org } = useAuth();
  const [copied, setCopied] = useState(false);
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [inviteCode, setInviteCode] = useState(null);

  useEffect(() => {
    setInviteCode(org?.invite_code || null);
  }, [org]);

  useEffect(() => {
    // The backend doesn't have a /users endpoint yet, so we show placeholder
    setMembersLoading(false);
  }, []);

  const copyCode = () => {
    const code = inviteCode || org?.invite_code;
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const regenerateCode = async () => {
    setRegenerating(true);
    try {
      // If a regenerate endpoint exists, call it here
      // For now, show the existing code
      setTimeout(() => {
        setRegenerating(false);
      }, 500);
    } catch {
      setRegenerating(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-[13px] text-danger bg-danger/10 border border-danger/20 px-3 py-2">
          You do not have access to this page.
        </div>
      </div>
    );
  }

  const currentCode = inviteCode || org?.invite_code;

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-lg font-semibold text-text-primary">Admin</h1>
        <p className="text-[13px] text-text-secondary mt-0.5">
          Manage your organisation
        </p>
      </div>

      {/* A. Organisation Settings */}
      <div className="bg-surface border border-border p-5 mb-6">
        <h2 className="text-[15px] font-medium text-text-primary mb-1">
          {org?.name || '—'}
        </h2>
        <p className="text-[12px] text-text-secondary mb-5">
          Organisation settings
        </p>

        <div className="border-t border-border pt-5">
          <p className="text-[11px] text-text-secondary uppercase tracking-wider mb-2">
            Invite Code
          </p>

          <div className="bg-bg border border-border p-3 flex items-center justify-between mb-3">
            <code className="text-[14px] font-mono text-accent select-all">
              {currentCode || '—'}
            </code>
            <button
              onClick={copyCode}
              className="p-1.5 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              title="Copy invite code"
            >
              {copied ? (
                <Check size={14} className="text-success" />
              ) : (
                <Copy size={14} />
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={regenerateCode}
              disabled={regenerating}
              className="flex items-center gap-1.5 text-[12px] text-text-secondary hover:text-text-primary bg-surface border border-border hover:border-accent/30 px-3 py-1.5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw size={12} className={regenerating ? 'animate-spin' : ''} />
              Regenerate invite code
            </button>
          </div>

          <p className="text-[11px] text-text-secondary mt-3">
            Share this code with team members to let them register as analysts.
          </p>
        </div>
      </div>

      {/* B. Team Members */}
      <div>
        <h2 className="text-[14px] font-medium text-text-primary mb-4">
          Team Members
        </h2>
        <div className="border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="text-left text-[11px] font-medium text-text-secondary px-4 py-2.5 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="text-left text-[11px] font-medium text-text-secondary px-4 py-2.5 uppercase tracking-wider hidden sm:table-cell">
                    Email
                  </th>
                  <th className="text-left text-[11px] font-medium text-text-secondary px-4 py-2.5 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left text-[11px] font-medium text-text-secondary px-4 py-2.5 uppercase tracking-wider hidden md:table-cell">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Current user row */}
                <tr className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-[13px] text-text-primary">
                    You
                  </td>
                  <td className="px-4 py-3 text-[13px] text-text-secondary hidden sm:table-cell">
                    —
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 ${
                        user?.role === 'admin'
                          ? 'bg-accent/15 text-accent'
                          : 'bg-white/5 text-text-secondary'
                      }`}
                    >
                      {user?.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-text-secondary hidden md:table-cell">
                    —
                  </td>
                </tr>
                {/* Additional members would be listed here when a /users endpoint exists */}
                {members.map((member) => (
                  <tr key={member.id} className="border-b border-border last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-[13px] text-text-primary">
                      {member.name}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-text-secondary hidden sm:table-cell">
                      {member.email}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 ${
                          member.role === 'admin'
                            ? 'bg-accent/15 text-accent'
                            : 'bg-white/5 text-text-secondary'
                        }`}
                      >
                        {member.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-text-secondary hidden md:table-cell">
                      {new Date(member.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

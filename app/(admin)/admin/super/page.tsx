'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ShieldCheck, Users, Ban, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

type UserProfile = {
  id: string;
  full_name: string;
  role: string;
  department: string | null;
  reputation_score: number;
};

export default function SuperAdminPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('role', { ascending: true });

        if (error) throw error;
        setUsers(data as UserProfile[]);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsers();
  }, [supabase]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      console.error("Failed to update role:", err);
      alert("Failed to update user role");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">System Administration</h1>
        <p className="text-text-secondary">Manage platform access, roles, and department assignments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <div className="text-2xl font-bold">{users.length}</div>
            <div className="text-sm text-text-secondary">Total Users</div>
          </div>
        </div>
        
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'department_admin' || u.role === 'super_admin').length}
            </div>
            <div className="text-sm text-text-secondary">Platform Admins</div>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-urgency-red/10 rounded-xl flex items-center justify-center">
            <Ban className="w-6 h-6 text-urgency-red" />
          </div>
          <div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-text-secondary">Suspended Accounts</div>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-card-border bg-navy-light/30 flex items-center justify-between">
          <h2 className="text-lg font-bold">User Directory</h2>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search users..." 
              className="px-4 py-2 bg-navy border border-card-border rounded-lg text-sm focus:outline-none focus:border-primary/50"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-secondary uppercase bg-navy/50 border-b border-card-border">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Reputation</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium">Role Access</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  key={user.id} 
                  className="border-b border-card-border hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-text-primary mb-0.5">{user.full_name}</div>
                    <div className="text-xs text-text-secondary font-mono truncate w-32" title={user.id}>{user.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-bold text-primary">
                      {user.reputation_score}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.department || <span className="text-text-secondary italic">Citizen (N/A)</span>}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer border focus:outline-none appearance-none ${
                        user.role === 'super_admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                        user.role === 'department_admin' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                        'bg-navy-light text-text-secondary border-card-border'
                      }`}
                    >
                      <option value="citizen">Citizen</option>
                      <option value="department_admin">Dept Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-text-secondary hover:text-primary transition-colors rounded-lg hover:bg-white/5">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-text-secondary hover:text-urgency-red transition-colors rounded-lg hover:bg-white/5">
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              
              {users.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-text-secondary">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

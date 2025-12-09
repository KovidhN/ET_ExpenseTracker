import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Group } from '../types';
import { Plus, LogIn, Users, ChevronRight, LogOut, Loader2, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface GroupListProps {
  onSelectGroup: (group: Group) => void;
  onLogout: () => void;
}

export const GroupList: React.FC<GroupListProps> = ({ onSelectGroup, onLogout }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'create' | 'join'>('list');
  const [newGroupName, setNewGroupName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch groups where the user is a member
      const { data, error } = await supabase
        .from('group_members')
        .select('group_id, groups(*)')
        .eq('user_id', user.id);

      if (error) throw error;

      if (data) {
        // @ts-ignore - Supabase types mapping
        const mappedGroups = data.map(item => item.groups).filter(Boolean) as Group[];
        setGroups(mappedGroups);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // 1. Create Group
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .insert({ name: newGroupName, code, created_by: user.id })
        .select()
        .single();

      if (groupError) throw groupError;

      // 2. Add creator as member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({ group_id: group.id, user_id: user.id });

      if (memberError) throw memberError;

      setGroups([...groups, group]);
      setView('list');
      setNewGroupName('');
    } catch (error) {
      alert('Error creating group');
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // 1. Find Group
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('code', joinCode.toUpperCase())
        .single();

      if (groupError || !group) {
        alert('Invalid group code');
        setActionLoading(false);
        return;
      }

      // 2. Check if already member (Robust check using maybeSingle)
      const { data: existingMember } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', group.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingMember) {
        alert('You are already in this group');
        setActionLoading(false);
        return;
      }

      // 3. Add as member
      const { error: joinError } = await supabase
        .from('group_members')
        .insert({ group_id: group.id, user_id: user.id });

      if (joinError) throw joinError;

      setGroups([...groups, group]);
      setView('list');
      setJoinCode('');
    } catch (error) {
      alert('Error joining group');
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900">My Groups</h1>
            <p className="text-sm text-slate-500 font-medium">Select a group to view expenses</p>
          </div>
          <button 
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {view === 'list' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => setView('create')}
                className="flex items-center justify-center gap-2 p-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
              >
                <Plus className="w-5 h-5" /> Create Group
              </button>
              <button
                onClick={() => setView('join')}
                className="flex items-center justify-center gap-2 p-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all"
              >
                <LogIn className="w-5 h-5" /> Join Group
              </button>
            </div>

            {groups.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 border-dashed">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No groups yet</h3>
                <p className="text-slate-500">Create or join a group to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {groups.map((group) => (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => onSelectGroup(group)}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-lg">
                        {group.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">{group.name}</h3>
                        <p className="text-xs font-medium text-slate-400">Code: {group.code}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'create' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
              <h2 className="text-xl font-bold mb-6">Create New Group</h2>
              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Group Name</label>
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    placeholder="e.g. Goa Trip"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setView('list')}
                    className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? 'Creating...' : 'Create Group'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {view === 'join' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
              <h2 className="text-xl font-bold mb-6">Join Existing Group</h2>
              <form onSubmit={handleJoinGroup} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Group Code</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none uppercase tracking-widest"
                      placeholder="ENTER CODE"
                      required
                      maxLength={6}
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setView('list')}
                    className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? 'Joining...' : 'Join Group'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

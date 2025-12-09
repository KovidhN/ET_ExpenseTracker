import React, { useState } from 'react';
import { Users, ArrowRight, Sparkles, ShieldCheck, LogIn } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Group } from '../types';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onJoinGroup: (group: Group) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onJoinGroup }) => {
  const [isCreating, setIsCreating] = useState(true);
  const [groupName, setGroupName] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const code = generateCode();
      const { data, error } = await supabase
        .from('groups')
        .insert({ name: groupName, code })
        .select()
        .single();

      if (error) throw error;
      if (data) onJoinGroup(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('code', groupCode.toUpperCase())
        .single();

      if (error || !data) throw new Error('Invalid group code');
      onJoinGroup(data);
    } catch (err: any) {
      setError(err.message || 'Group not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=3432&auto=format&fit=crop')",
        }}
      />
      <div className="absolute inset-0 z-0 bg-slate-900/60 backdrop-blur-sm" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="p-8 text-center border-b border-slate-100">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-2">ET: Expense Tracker</h1>
            <p className="text-slate-500">Collaborate on expenses with friends.</p>
          </div>

          <div className="p-8">
            <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
              <button
                onClick={() => setIsCreating(true)}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                  isCreating ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Create Group
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                  !isCreating ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Join Group
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-50 text-rose-600 text-sm font-medium rounded-xl flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                {error}
              </div>
            )}

            {isCreating ? (
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Group Name</label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="e.g. Goa Trip 2025"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? 'Creating...' : (
                    <>
                      <Sparkles className="w-4 h-4" /> Create & Start
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleJoin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Group Code</label>
                  <input
                    type="text"
                    value={groupCode}
                    onChange={(e) => setGroupCode(e.target.value)}
                    placeholder="Enter 6-character code"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all uppercase tracking-widest"
                    required
                    maxLength={6}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/25 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? 'Joining...' : (
                    <>
                      <LogIn className="w-4 h-4" /> Join Group
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
        <p className="text-center text-white/40 text-xs mt-6 font-medium">
          Secure • Real-time • Simple
        </p>
      </motion.div>
    </div>
  );
};

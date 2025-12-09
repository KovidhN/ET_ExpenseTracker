import React from 'react';
import { Wallet, RotateCcw, Cloud, LogOut, Share2, ChevronLeft, User } from 'lucide-react';
import { Group } from '../types';

interface HeaderProps {
  group: Group;
  isAdmin: boolean;
  userEmail?: string;
  onReset: () => void;
  onExit: () => void;
}

export const Header: React.FC<HeaderProps> = ({ group, isAdmin, userEmail, onReset, onExit }) => {
  const handleShare = async () => {
    const shareData = {
      title: `Join ${group.name}`,
      text: `Join my expense group "${group.name}" on ET: Expense Tracker using code: ${group.code}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        copyCode();
      }
    } else {
      copyCode();
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(group.code);
    alert(`Group code ${group.code} copied to clipboard!`);
  };

  return (
    <header className="bg-white/60 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onExit}
            className="p-2 -ml-2 text-slate-400 hover:text-slate-700 hover:bg-white/50 rounded-xl transition-all sm:hidden"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="relative group cursor-pointer hidden sm:block" onClick={handleShare}>
            <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />
            <div className="relative bg-gradient-to-br from-indigo-600 to-violet-600 p-3 rounded-2xl shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
              <Wallet className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              {group.name}
              <button 
                onClick={handleShare}
                className="inline-flex items-center px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider border border-indigo-100 hover:bg-indigo-100 transition-colors"
              >
                Code: {group.code} <Share2 className="w-3 h-3 ml-1" />
              </button>
            </h1>
            <div className="flex items-center gap-2">
              <p className="text-sm text-slate-500 font-medium hidden sm:block">
                {isAdmin ? 'Admin Access' : 'Member View'}
              </p>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                <Cloud className="w-3 h-3" /> Live
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {userEmail && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 mr-2">
              <User className="w-3 h-3 text-slate-400" />
              <span className="text-xs font-medium text-slate-500">{userEmail}</span>
            </div>
          )}
          
          {isAdmin && (
            <button
              onClick={() => {
                if (window.confirm('WARNING: This will delete ALL expenses and people in this group. This cannot be undone.')) {
                  onReset();
                }
              }}
              className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
              title="Reset Group Data (Admin Only)"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}
          <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block" />
          <button
            onClick={onExit}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">My Groups</span>
          </button>
        </div>
      </div>
    </header>
  );
};

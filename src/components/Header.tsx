import React from 'react';
import { Wallet, RotateCcw, Sparkles } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="bg-white/60 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />
            <div className="relative bg-gradient-to-br from-indigo-600 to-violet-600 p-3 rounded-2xl shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
              <Wallet className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              ET: Expense Tracker
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
                <Sparkles className="w-3 h-3 mr-1" /> Pro
              </span>
            </h1>
            <p className="text-sm text-slate-500 font-medium">Simplify your shared spending</p>
          </div>
        </div>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to delete all data?')) {
              onReset();
            }
          }}
          className="group flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-all duration-300 border border-transparent hover:border-rose-100"
        >
          <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
          <span className="hidden sm:inline">Reset All</span>
        </button>
      </div>
    </header>
  );
};

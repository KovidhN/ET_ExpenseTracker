import React from 'react';
import { PersonTotal } from '../types';
import { IndianRupee, TrendingDown, TrendingUp, CheckCircle2, Wallet } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface DueAmountsProps {
  totals: PersonTotal[];
  totalGroupSpend: number;
  perPersonShare: number;
}

export const DueAmounts: React.FC<DueAmountsProps> = ({ totals, totalGroupSpend, perPersonShare }) => {
  if (totals.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 p-8 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Wallet className="w-8 h-8 text-slate-300" />
        </div>
        <h2 className="text-base font-bold text-slate-900">Settlement Pending</h2>
        <p className="text-sm text-slate-500 mt-1">Add expenses to see who owes what.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 p-6 sticky top-28">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
            <IndianRupee className="w-5 h-5" />
          </div>
          Settlement Plan
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 relative overflow-hidden">
            <div className="absolute right-0 top-0 p-3 opacity-5">
              <Wallet className="w-12 h-12" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Spend</p>
            <p className="text-xl font-black text-slate-900">₹{totalGroupSpend.toFixed(0)}</p>
          </div>
          <div className="bg-indigo-50/80 p-4 rounded-2xl border border-indigo-100 relative overflow-hidden">
            <div className="absolute right-0 top-0 p-3 opacity-5">
              <IndianRupee className="w-12 h-12 text-indigo-900" />
            </div>
            <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">Per Person</p>
            <p className="text-xl font-black text-indigo-900">₹{perPersonShare.toFixed(0)}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        {totals.map((person, index) => {
          const isOwed = person.balance > 1;
          const isOwing = person.balance < -1;
          const isSettled = !isOwed && !isOwing;

          return (
            <motion.div 
              key={person.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={clsx(
                "p-4 rounded-2xl border-2 transition-all relative overflow-hidden group",
                isOwed && "bg-emerald-50/50 border-emerald-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5",
                isOwing && "bg-rose-50/50 border-rose-100 hover:border-rose-200 hover:shadow-lg hover:shadow-rose-500/5",
                isSettled && "bg-slate-50/50 border-slate-100"
              )}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className={clsx(
                    "w-12 h-12 rounded-2xl flex items-center justify-center text-base font-bold shadow-sm transition-transform group-hover:scale-105",
                    isOwed && "bg-emerald-100 text-emerald-700",
                    isOwing && "bg-rose-100 text-rose-700",
                    isSettled && "bg-slate-200 text-slate-600"
                  )}>
                    {person.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-base">{person.name}</p>
                    <p className="text-xs font-medium text-slate-500">Paid: ₹{person.totalPaid.toFixed(0)}</p>
                  </div>
                </div>

                <div className="text-right">
                  {isSettled ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Settled
                    </span>
                  ) : (
                    <>
                      <p className={clsx(
                        "text-xs font-bold uppercase tracking-wide mb-0.5 flex items-center justify-end gap-1",
                        isOwed ? "text-emerald-600" : "text-rose-600"
                      )}>
                        {isOwed ? "Gets back" : "Owes"}
                        {isOwed ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      </p>
                      <p className={clsx(
                        "text-xl font-black",
                        isOwed ? "text-emerald-700" : "text-rose-700"
                      )}>
                        ₹{Math.abs(person.balance).toFixed(0)}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

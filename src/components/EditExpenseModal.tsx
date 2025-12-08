import React, { useState, useEffect } from 'react';
import { Expense } from '../types';
import { X, Save, Calendar, IndianRupee, User, MapPin, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EditExpenseModalProps {
  isOpen: boolean;
  expense: Expense | null;
  people: string[];
  onClose: () => void;
  onSave: (updatedExpense: Expense) => void;
}

export const EditExpenseModal: React.FC<EditExpenseModalProps> = ({
  isOpen,
  expense,
  people,
  onClose,
  onSave,
}) => {
  const [person, setPerson] = useState('');
  const [where, setWhere] = useState('');
  const [what, setWhat] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (expense) {
      setPerson(expense.person);
      setWhere(expense.where);
      setWhat(expense.what);
      setAmount(expense.amount.toString());
      setDate(expense.date);
    }
  }, [expense]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (expense && person && where && what && amount) {
      onSave({
        ...expense,
        person,
        where,
        what,
        amount: Math.round(parseFloat(amount)), // Ensure integer
        date,
      });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[70] px-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-lg text-slate-900">Edit Expense</h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                    Paid By
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                    <select
                      value={person}
                      onChange={(e) => setPerson(e.target.value)}
                      className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white rounded-2xl border border-slate-200 pl-11 pr-4 py-3 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer font-medium text-slate-700"
                      required
                    >
                      {people.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                      Where
                    </label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={where}
                        onChange={(e) => setWhere(e.target.value)}
                        className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white rounded-2xl border border-slate-200 pl-11 pr-4 py-3 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                      For What
                    </label>
                    <div className="relative group">
                      <Tag className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={what}
                        onChange={(e) => setWhat(e.target.value)}
                        className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white rounded-2xl border border-slate-200 pl-11 pr-4 py-3 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                      Amount
                    </label>
                    <div className="relative group">
                      <IndianRupee className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === '.' || e.key === 'e' || e.key === '-') {
                            e.preventDefault();
                          }
                        }}
                        step="1"
                        className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white rounded-2xl border border-slate-200 pl-11 pr-4 py-3 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                      Date
                    </label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white rounded-2xl border border-slate-200 pl-11 pr-4 py-3 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-600 font-medium"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white px-6 py-3.5 rounded-2xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-500/25 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

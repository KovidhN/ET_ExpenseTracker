import React from 'react';
import { Expense } from '../types';
import { Receipt, Calendar, MapPin, Pencil, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onEdit, onDelete }) => {
  if (expenses.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 p-12 text-center">
        <div className="bg-indigo-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
          <Receipt className="w-10 h-10 text-indigo-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">No expenses yet</h3>
        <p className="text-slate-500 mt-2 max-w-sm mx-auto">Your expense history will appear here once you start adding transactions.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 overflow-hidden">
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
            <Receipt className="w-5 h-5" />
          </div>
          Recent Activity
        </h2>
        <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
          {expenses.length} transactions
        </span>
      </div>
      
      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 first:rounded-tl-lg">Date</th>
              <th className="px-6 py-5">Paid By</th>
              <th className="px-6 py-5">Description</th>
              <th className="px-6 py-5 text-right">Amount</th>
              <th className="px-6 py-5 text-right last:rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {expenses.map((expense, index) => (
              <motion.tr 
                key={expense.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-indigo-50/30 transition-colors group cursor-default"
              >
                <td className="px-8 py-5 text-slate-500 whitespace-nowrap font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                    {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white text-indigo-600 border border-indigo-100 shadow-sm">
                    {expense.person}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-slate-900 font-semibold">{expense.what}</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" /> {expense.where}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-base">
                    ₹{expense.amount.toFixed(0)}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(expense)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(expense.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile List */}
      <div className="sm:hidden divide-y divide-slate-100">
        {expenses.map((expense, index) => (
          <motion.div 
            key={expense.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-5 hover:bg-slate-50 transition-colors"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                  {expense.person.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{expense.what}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {expense.where}
                  </p>
                </div>
              </div>
              <span className="font-bold text-slate-900 text-lg">₹{expense.amount.toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center pl-[52px]">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <div className="flex items-center gap-2">
                 <button 
                    onClick={() => onEdit(expense)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 bg-slate-50 rounded-md"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => onDelete(expense.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 bg-slate-50 rounded-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

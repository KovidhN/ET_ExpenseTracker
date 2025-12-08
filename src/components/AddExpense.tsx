import React, { useState } from 'react';
import { PlusCircle, Calendar, IndianRupee, User, MapPin, Tag } from 'lucide-react';

interface AddExpenseProps {
  people: string[];
  onAdd: (expense: { person: string; where: string; what: string; amount: number; date: string }) => void;
}

export const AddExpense: React.FC<AddExpenseProps> = ({ people, onAdd }) => {
  const today = new Date().toISOString().split('T')[0];
  
  const [person, setPerson] = useState('');
  const [where, setWhere] = useState('');
  const [what, setWhat] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(today);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (person && where && what && amount) {
      onAdd({
        person,
        where,
        what,
        amount: Math.round(parseFloat(amount)), // Ensure integer
        date
      });
      setWhere('');
      setWhat('');
      setAmount('');
    }
  };

  if (people.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 p-8 text-center relative overflow-hidden">
        <div className="relative z-10">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-4">
            <PlusCircle className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No people yet</h3>
          <p className="text-sm text-slate-500 mt-2 max-w-[200px] mx-auto">Add your friends or roommates above to start tracking expenses.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500" />
      
      <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-3">
        <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
          <PlusCircle className="w-5 h-5" />
        </div>
        New Expense
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Paid By</label>
          <div className="relative group">
            <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <select
              value={person}
              onChange={(e) => setPerson(e.target.value)}
              className="w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white rounded-2xl border border-slate-200 pl-11 pr-4 py-3 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer font-medium text-slate-700"
              required
            >
              <option value="" disabled>Select a person</option>
              {people.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <div className="absolute right-4 top-4 pointer-events-none">
              <div className="w-2 h-2 border-r-2 border-b-2 border-slate-400 rotate-45 mb-0.5" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Where</label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                value={where}
                onChange={(e) => setWhere(e.target.value)}
                placeholder="Ex. Uber"
                className="w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white rounded-2xl border border-slate-200 pl-11 pr-4 py-3 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">For What</label>
            <div className="relative group">
              <Tag className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                value={what}
                onChange={(e) => setWhat(e.target.value)}
                placeholder="Ex. Taxi"
                className="w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white rounded-2xl border border-slate-200 pl-11 pr-4 py-3 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Amount</label>
            <div className="relative group">
              <IndianRupee className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
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
                placeholder="0"
                className="w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white rounded-2xl border border-slate-200 pl-11 pr-4 py-3 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Date</label>
            <div className="relative group">
              <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white rounded-2xl border border-slate-200 pl-11 pr-4 py-3 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-600 font-medium"
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-4 rounded-2xl hover:from-indigo-700 hover:to-violet-700 transition-all font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-[0.98] mt-2 flex items-center justify-center gap-2 group"
        >
          <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Add Expense
        </button>
      </form>
    </div>
  );
};

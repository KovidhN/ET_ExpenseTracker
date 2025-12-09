import React, { useState } from 'react';
import { UserPlus, User } from 'lucide-react';

interface AddPersonProps {
  groupId: string;
  onAdd: (name: string) => void;
}

export const AddPerson: React.FC<AddPersonProps> = ({ groupId, onAdd }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim());
      setName('');
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500" />
      
      <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-3 relative z-10">
        <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
          <UserPlus className="w-5 h-5" />
        </div>
        Add People
      </h2>
      
      <form onSubmit={handleSubmit} className="flex gap-3 relative z-10">
        <div className="relative flex-1 group/input">
          <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors duration-300" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name (e.g. Alice)"
            className="w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white rounded-2xl border border-slate-200 pl-11 pr-4 py-3 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium"
          />
        </div>
        <button
          type="submit"
          disabled={!name.trim()}
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-sm shadow-lg shadow-slate-900/10 hover:shadow-indigo-500/25 active:scale-95"
        >
          Add
        </button>
      </form>
    </div>
  );
};

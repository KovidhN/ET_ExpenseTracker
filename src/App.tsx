import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { AddPerson } from './components/AddPerson';
import { AddExpense } from './components/AddExpense';
import { ExpenseList } from './components/ExpenseList';
import { DueAmounts } from './components/DueAmounts';
import { EditExpenseModal } from './components/EditExpenseModal';
import { Expense, PersonTotal } from './types';
import { motion } from 'framer-motion';

function App() {
  const [people, setPeople] = useState<string[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const handleAddPerson = (name: string) => {
    if (!people.includes(name)) {
      setPeople([...people, name]);
    } else {
      alert('Person already exists!');
    }
  };

  const handleAddExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expense: Expense = {
      ...newExpense,
      id: crypto.randomUUID(),
    };
    setExpenses([expense, ...expenses]); // Add new expense to top
  };

  const handleDeleteExpense = (id: string) => {
    if (window.confirm('Delete this expense?')) {
      setExpenses(expenses.filter(e => e.id !== id));
    }
  };

  const handleUpdateExpense = (updatedExpense: Expense) => {
    setExpenses(expenses.map(e => e.id === updatedExpense.id ? updatedExpense : e));
  };

  const handleReset = () => {
    setPeople([]);
    setExpenses([]);
  };

  // Calculate totals and splits
  const { totals, totalGroupSpend, perPersonShare } = useMemo(() => {
    const map: Record<string, number> = {};
    
    // Initialize all people with 0
    people.forEach(p => map[p] = 0);
    
    // Sum up expenses per person
    let groupTotal = 0;
    expenses.forEach(e => {
      if (map[e.person] !== undefined) {
        map[e.person] += e.amount;
        groupTotal += e.amount;
      }
    });

    const share = people.length > 0 ? groupTotal / people.length : 0;

    const calculatedTotals: PersonTotal[] = Object.entries(map)
      .map(([name, totalPaid]) => ({ 
        name, 
        totalPaid,
        balance: totalPaid - share 
      }))
      .sort((a, b) => b.totalPaid - a.totalPaid);

    return {
      totals: calculatedTotals,
      totalGroupSpend: groupTotal,
      perPersonShare: share
    };
  }, [people, expenses]);

  return (
    <div className="min-h-screen font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 relative overflow-x-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-fixed"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=3540&auto=format&fit=crop')",
        }}
      />
      {/* Overlay for readability */}
      <div className="fixed inset-0 z-0 bg-slate-50/50 backdrop-blur-[2px]" />

      <div className="relative z-10">
        <Header onReset={handleReset} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Forms */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <AddPerson onAdd={handleAddPerson} />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
              >
                <AddExpense people={people} onAdd={handleAddExpense} />
              </motion.div>
            </div>

            {/* Right Column: Data & Summary */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Summary Column */}
               <motion.div 
                 className="md:col-span-1 md:order-last"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
               >
                  <DueAmounts 
                    totals={totals} 
                    totalGroupSpend={totalGroupSpend}
                    perPersonShare={perPersonShare}
                  />
               </motion.div>

               {/* Table Column */}
               <motion.div 
                 className="md:col-span-2 md:order-first"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
               >
                  <ExpenseList 
                    expenses={expenses} 
                    onEdit={setEditingExpense}
                    onDelete={handleDeleteExpense}
                  />
               </motion.div>
            </div>
          </div>
        </main>

        <EditExpenseModal 
          isOpen={!!editingExpense}
          expense={editingExpense}
          people={people}
          onClose={() => setEditingExpense(null)}
          onSave={handleUpdateExpense}
        />
      </div>
    </div>
  );
}

export default App;

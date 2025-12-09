import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { AddPerson } from './components/AddPerson';
import { AddExpense } from './components/AddExpense';
import { ExpenseList } from './components/ExpenseList';
import { DueAmounts } from './components/DueAmounts';
import { EditExpenseModal } from './components/EditExpenseModal';
import { AuthPage } from './components/AuthPage';
import { GroupList } from './components/GroupList';
import { Comments } from './components/Comments';
import { Expense, PersonTotal, Group } from './types';
import { motion } from 'framer-motion';
import { supabase } from './lib/supabase';
import { Loader2 } from 'lucide-react';
import { Session } from '@supabase/supabase-js';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  
  const [people, setPeople] = useState<string[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Auth State Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch data for the current group
  useEffect(() => {
    if (currentGroup) {
      fetchData();
    } else {
      setPeople([]);
      setExpenses([]);
    }
  }, [currentGroup]);

  const fetchData = async () => {
    if (!currentGroup) return;
    setLoading(true);

    try {
      // Fetch People
      const { data: peopleData } = await supabase
        .from('people')
        .select('name')
        .eq('group_id', currentGroup.id)
        .order('created_at', { ascending: true });
      
      if (peopleData) {
        setPeople(peopleData.map(p => p.name));
      }

      // Fetch Expenses
      const { data: expenseData } = await supabase
        .from('expenses')
        .select('*')
        .eq('group_id', currentGroup.id)
        .order('expense_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (expenseData) {
        const mappedExpenses: Expense[] = expenseData.map(e => ({
          id: e.id,
          group_id: e.group_id,
          person: e.person,
          where: e.place,
          what: e.description,
          amount: e.amount,
          date: e.expense_date || e.date || new Date().toISOString().split('T')[0]
        }));
        setExpenses(mappedExpenses);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Realtime Subscription
  useEffect(() => {
    if (!currentGroup) return;

    const channel = supabase
      .channel(`group-${currentGroup.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', filter: `group_id=eq.${currentGroup.id}` },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentGroup]);

  const handleAddPerson = async (name: string) => {
    if (!currentGroup) return;
    if (!people.includes(name)) {
      setPeople([...people, name]);
      
      const { error } = await supabase
        .from('people')
        .insert({ name, group_id: currentGroup.id });

      if (error) {
        alert('Error adding person: ' + error.message);
        fetchData();
      }
    } else {
      alert('Person already exists!');
    }
  };

  const handleAddExpense = async (newExpense: Omit<Expense, 'id' | 'group_id'>) => {
    if (!currentGroup) return;
    const { error } = await supabase
      .from('expenses')
      .insert({
        group_id: currentGroup.id,
        person: newExpense.person,
        place: newExpense.where,
        description: newExpense.what,
        amount: newExpense.amount,
        expense_date: newExpense.date
      });

    if (error) {
      alert('Error adding expense: ' + error.message);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (window.confirm('Delete this expense?')) {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) {
        alert('Error deleting expense: ' + error.message);
      }
    }
  };

  const handleUpdateExpense = async (updatedExpense: Expense) => {
    const { error } = await supabase
      .from('expenses')
      .update({
        person: updatedExpense.person,
        place: updatedExpense.where,
        description: updatedExpense.what,
        amount: updatedExpense.amount,
        expense_date: updatedExpense.date
      })
      .eq('id', updatedExpense.id);

    if (error) {
      alert('Error updating expense: ' + error.message);
    }
  };

  const handleReset = async () => {
    if (!currentGroup) return;
    setLoading(true);
    await supabase.from('expenses').delete().eq('group_id', currentGroup.id);
    await supabase.from('people').delete().eq('group_id', currentGroup.id);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentGroup(null);
  };

  // Calculate totals
  const { totals, totalGroupSpend, perPersonShare } = useMemo(() => {
    const map: Record<string, number> = {};
    people.forEach(p => map[p] = 0);
    
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

  // Loading State
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  // Auth Flow
  if (!session) {
    return <AuthPage />;
  }

  // Group Selection Flow
  if (!currentGroup) {
    return <GroupList onSelectGroup={setCurrentGroup} onLogout={handleLogout} />;
  }

  // Main App Flow
  const isAdmin = session.user.id === currentGroup.created_by;

  return (
    <div className="min-h-screen font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 relative overflow-x-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-fixed"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=3540&auto=format&fit=crop')",
        }}
      />
      <div className="fixed inset-0 z-0 bg-slate-50/50 backdrop-blur-[2px]" />

      <div className="relative z-10">
        <Header 
          group={currentGroup}
          isAdmin={isAdmin}
          userEmail={session.user.email}
          onReset={handleReset} 
          onExit={() => setCurrentGroup(null)} 
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
              <p className="text-slate-500 font-medium animate-pulse">Syncing group data...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Forms */}
              <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <AddPerson groupId={currentGroup.id} onAdd={handleAddPerson} />
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                >
                  <AddExpense people={people} groupId={currentGroup.id} onAdd={handleAddExpense} />
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
                   className="md:col-span-2 md:order-first space-y-8"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                 >
                    <ExpenseList 
                      expenses={expenses} 
                      isAdmin={isAdmin}
                      onEdit={setEditingExpense}
                      onDelete={handleDeleteExpense}
                    />

                    <Comments groupId={currentGroup.id} />
                 </motion.div>
              </div>
            </div>
          )}
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

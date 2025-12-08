export interface Expense {
  id: string;
  person: string;
  where: string;
  what: string;
  amount: number;
  date: string;
}

export interface PersonTotal {
  name: string;
  totalPaid: number;
  balance: number; // Positive means they get back, negative means they owe
}

export interface Expense {
  id: string;
  group_id: string;
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

export interface Group {
  id: string;
  name: string;
  code: string;
  created_by: string;
  created_at?: string;
}

export interface Comment {
  id: string;
  group_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
}

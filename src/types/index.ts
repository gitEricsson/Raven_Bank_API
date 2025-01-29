export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface User {
  id?: number;
  email: string;
  password: string;
  role: Role;
  created_at?: Date;
  updated_at?: Date;
}

export interface Account {
  id?: number;
  user_id: number;
  account_number: string;
  balance: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface Transaction {
  id?: number;
  sender_account_id: number;
  receiver_account_id: number;
  amount: number;
  type: 'DEPOSIT' | 'TRANSFER';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  created_at?: Date;
  updated_at?: Date;
}

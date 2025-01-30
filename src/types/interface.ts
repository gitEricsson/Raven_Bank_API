import { Role, TransactionStatus, TransactionType } from './enums';

export interface User {
  id?: number;
  first_name: string;
  last_name: string;
  phone: string;
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
  type: TransactionType;
  status: TransactionStatus;
  created_at?: Date;
  updated_at?: Date;
}

import { accountRepository } from '../config/dependencies';

export async function generateAccountNumber(): Promise<string> {
  let accountNumber: string;
  let existingAccount: any;

  do {
    // Generate a random 10-digit number
    accountNumber = Math.floor(
      Math.random() * 9000000000 + 1000000000
    ).toString();
    existingAccount = await accountRepository.findByAccountNumber(
      accountNumber
    );
  } while (existingAccount);

  return accountNumber;
}

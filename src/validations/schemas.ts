import Joi from 'joi';

interface RegisterInput {
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface DepositInput {
  accountNumber: string;
  amount: number;
}

interface TransferInput {
  senderAccountNumber: string;
  receiverAccountNumber: string;
  amount: number;
}

export const userSchemas = {
  register: Joi.object<RegisterInput>({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),

  login: Joi.object<LoginInput>({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export const accountSchemas = {
  // No validation needed for create account as it only requires authentication
};

export const transactionSchemas = {
  deposit: Joi.object<DepositInput>({
    accountNumber: Joi.string().required(),
    amount: Joi.number().positive().required(),
  }),

  transfer: Joi.object<TransferInput>({
    senderAccountNumber: Joi.string().required(),
    receiverAccountNumber: Joi.string().required(),
    amount: Joi.number().positive().required(),
  }).custom((value: TransferInput) => {
    if (value.senderAccountNumber === value.receiverAccountNumber) {
      throw new Error('Sender and receiver accounts must be different');
    }
    return value;
  }),
};

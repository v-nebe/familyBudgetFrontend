import api from './apiService.ts'

export const transactionService = {
  getAllTransactions: () => api.get('/transaction/getAll'),
  addTransaction: async (TransactionData: transactionData) => await api.post('/transaction/create', TransactionData),
  updateTransaction: (TransactionData: editTransactionData) => api.put('/transaction/update', TransactionData),
  getCurrency: async () => await api.get('/currency/rates'),
};


interface transactionData {
  "user": object,
  "category": object,
  "currency": string,
  "amount": string,
  "date": string,
}

interface editTransactionData {
  idtransaction: number,
  "user": object,
  "category": object,
  "currency": string,
  "amount": string,
  "date": string,
}
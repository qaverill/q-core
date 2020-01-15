import axios from 'axios';

export const deleteTransaction = ordinal => {
  axios.delete(`/transaction/${ordinal}`);
};

import axios from 'axios';
import { NotificationManager } from 'react-notifications';

export const removeTransaction = (transaction, then) => {
  const { ordinal } = transaction;
  axios.delete(`/mongodb/transactions/${ordinal}`).then(res => {
    if (res.status === 200) {
      NotificationManager.success(`Successfully removed ordinal ${ordinal}`);
      then();
    } else {
      NotificationManager.error(`Failed to remove ordinal ${ordinal}`);
    }
  });
};

export const listens = {

};

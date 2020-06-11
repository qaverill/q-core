import { fetchDocuments } from '../api/mongodb';
import { actions } from './index';

export const fetchSettings = async dispatch => {
  const newSettings = await fetchDocuments({ collection: 'metadata', _id: 'settings' });
  dispatch(actions.storeSettings(newSettings));
};

export const fetchSpotifyQData = async (dispatch, query) => {
  const listens = await fetchDocuments({ collection: 'listens', query });
  const saves = await fetchDocuments({ collection: 'saves', query });
  const combinedData = listens.concat(saves).sort((a, b) => a.timestamp - b.timestamp);
  dispatch(actions.setSpotifyQData(combinedData));
};

export const DELETEME = 1;

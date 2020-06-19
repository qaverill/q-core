/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { NotificationManager } from 'react-notifications';
import { actions, useStore } from '../../store';

import Analyzer from './Analyzer';
import Viewer from './Viewer';
import PageSelector from '../../components/SlateSelector';
import ChronologicalSearchBar from '../../components/ChronologicalSearchBar';
import LoadingSpinner from '../../components/LoadingSpinner';

import { fetchDocuments, saveSettings, writeDocument } from '../../api/mongodb';
import { moneyTheme } from '../../packages/colors';
import { Slate } from '../../packages/core';
import { times } from '../../packages/utils';
import { selectSettings } from '../../store/selectors';

const collection = 'transactions';

const Feature = styled.div`
  width: 100%;
  height: calc(100% - 90px);
`;

const Money = () => {
  const { state, dispatch } = useStore();
  const { moneyIdx } = selectSettings(state);
  const [start, setStart] = useState(times.firstOfCurrentMonth());
  const [end, setEnd] = useState(times.now());
  const [filter, setFilter] = useState(null);
  const [data, setData] = useState(null);

  const updateTransaction = (newTransaction, idx) => new Promise(resolve => {
    const { _id } = newTransaction;
    setData(null);
    writeDocument({ collection, _id, document: newTransaction })
      .then(result => {
        if (result.status === 204) {
          const newData = data;
          delete newData[idx];
          newData[idx] = newTransaction;
          setData(newData);
          resolve();
        }
      })
      .catch((e) => {
        console.log(e);
        NotificationManager.error('Failed to update transaction fact', `_id: ${_id}`);
      });
  });

  useEffect(() => {
    const fetchData = async () => {
      const query = { start, end, filter };
      const transactions = await fetchDocuments({ collection, query });
      transactions.sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1));
      setData(transactions);
    };

    setData(null);
    fetchData();
  }, [start, end, filter]);

  const saveIdx = (idx) => {
    moneyIdx = idx;
    saveSettings(settings);
    dispatch(actions.setSettings(settings));
  };

  const dateControls = ['M', 'W'];

  return (
    <Slate rimColor={moneyTheme.primary}>
      <ChronologicalSearchBar
        start={start}
        end={end}
        setStart={setStart}
        setEnd={setEnd}
        setFilter={setFilter} // TODO: hook this set filter up yo
        dateControls={dateControls}
        colorTheme={moneyTheme}
      />
      <PageSelector
        pages={['Analytics', 'Data']}
        idx={moneyIdx}
        onChange={saveIdx}
      />
      {data == null
        ? <LoadingSpinner message="Loading Money..." />
        : (
          <Feature>
            {[
              <Analyzer data={data} />,
              <Viewer data={data} updateTransaction={updateTransaction} />,
            ][moneyIdx]}
          </Feature>
        )}
    </Slate>
  );
};

export default Money;

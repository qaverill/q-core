import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import TransactionFact from './transaction-fact';

const ViewContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const transactionContainsFilter = (transaction, filter) => (
  transaction.tags.includes(filter)
  || transaction.description.toLowerCase().includes(filter.toLowerCase())
);

class Viewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { data, filter, parent } = this.props;
    return (
      <ViewContainer>
        {data
          .filter(t => (filter != null ? transactionContainsFilter(t, filter) : true))
          .sort((a, b) => b.timestamp - a.timestamp)
          .map(t => <TransactionFact transaction={t} parent={parent} />)}
      </ViewContainer>
    );
  }
}

export default Viewer;

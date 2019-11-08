import React from 'react';
import styled from 'styled-components';
import TransactionFact from '@q/transaction-fact';

const TaggerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  width: 100%;
`;

class Tagger extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { data } = this.props;
    return (
      <TaggerContainer>
        {data.map(transaction => (
          <TransactionFact transaction={transaction} />
        ))}
      </TaggerContainer>
    );
  }
}

export default Tagger;

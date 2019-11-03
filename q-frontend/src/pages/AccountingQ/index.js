import React from 'react';
import styled from 'styled-components';
import TimeFrame from '../../components/TimeFrame';
import { Page } from '../../components/styled-components';

const { accountingQTheme } = require('q-colors');

const AccountingQPage = styled(Page)`
  border: 5px solid ${accountingQTheme.primary};
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

class AccountingQ extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <AccountingQPage>
        <TimeFrame parent={this} color={accountingQTheme.tertiary} />
      </AccountingQPage>
    );
  }
}

export default AccountingQ;

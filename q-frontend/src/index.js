/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import styled from 'styled-components';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import { getSettings } from '@q/utils';

import DataQ from './pages/DataQ';
import SpotifyQ from './pages/SpotifyQ';
import BassQ from './pages/BassQ';
import AccountingQ from './pages/AccountingQ';
import DashboardQ from './pages/DashboardQ';
import ArraySelector from './components/array-selector';

const AppContainer = styled.div`
  height: 100%;
  width: 100%;
  background-color: black;
`;

const AppHeader = styled.div`
  background-color: black;
  font-size: 20px;
  font-weight: bold;
  color: white;
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  z-index: 100;
`;

const Title = styled.h2`
  margin: 0 10px;
`;


class App extends React.Component {
  constructor(props) {
    super(props);
    this.pages = [
      <DataQ title={<Title>DataQ</Title>} root={this} />,
      <SpotifyQ title={<Title>SpotifyQ</Title>} root={this} />,
      // <BassQ title={<Title>BassQ</Title>} />,
      <AccountingQ title={<Title>AccountingQ</Title>} />,
      <DashboardQ title={<Title>DashboardQ</Title>} />,
    ];
    this.state = {
      selectedIndex: getSettings() != null ? getSettings().lastPageIndex : 0,
      error: null,
    };
  }

  componentDidMount() {
    const _this = this;
    axios.get('/mongodb/settings').then(res => {
      sessionStorage.setItem('settings', JSON.stringify(res.data));
      _this.setState({
        selectedIndex: res.data.lastPageIndex,
      });
    });
  }

  renderPage() {
    const { error, selectedIndex } = this.state;
    return error != null ? error : this.pages[selectedIndex];
  }

  render() {
    if (getSettings() == null) {
      return (
        <AppContainer>
          <AppHeader>
            <h2>Loading...</h2>
          </AppHeader>
        </AppContainer>
      );
    }
    const { selectedIndex } = this.state;
    return (
      <AppContainer>
        <NotificationContainer />
        <AppHeader>
          <ArraySelector
            array={this.pages}
            parent={this}
            title={this.pages[selectedIndex].props.title}
            settingsKey="lastPageIndex"
          />
        </AppHeader>
        {this.renderPage()}
      </AppContainer>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

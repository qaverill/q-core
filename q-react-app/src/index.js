import React from 'react'
import ReactDOM from 'react-dom'
import DataQ from './pages/DataQ';
import SpotifyQ from './pages/SpotifyQ';
import BassQ from './pages/BassQ';
import styled from 'styled-components';
import ArraySelector from './components/ArraySelector/index'
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

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
  constructor(props){
    super(props);
    this.pages = [
      <DataQ title={<Title>DataQ</Title>} root={this} />,
      <SpotifyQ title={<Title>SpotifyQ</Title>} root={this} />,
      <BassQ title={<Title>BassQ</Title>} />
    ];
    this.state = {
      selectedItem: this.pages[1]
    };
  }

  render() {
    return (
      <AppContainer>
        <NotificationContainer />
        <AppHeader>
          <ArraySelector array={this.pages} parent={this} title={this.state.selectedItem.props.title}/>
        </AppHeader>
        {this.renderPage()}
      </AppContainer>
    );
  }

  renderPage() {
    if (this.state.error != null){
      return this.state.error
    } else {
      return this.state.selectedItem
    }
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

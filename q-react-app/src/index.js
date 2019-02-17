import React from 'react'
import ReactDOM from 'react-dom'
import DataQ from './pages/DataQ';
import SpotifyQ from './pages/SpotifyQ';
import BassQ from './pages/BassQ';
import styled from 'styled-components';
import ArraySelector from './components/ArraySelector/arraySelector'
import { NotificationContainer } from 'react-notifications';
import { blue, green } from "./colors";
import { moveIndexLeft, moveIndexRight } from "./utils";
import {ErrorPage, errorPage} from "./components/components";

const AppContainer = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const AppHeader = styled.div`
  font-size: 20px;
  font-weight: bold;
  background-color: black;
  color: white;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
`;

const AppBody = styled.div`
  height: calc(100% - 50px);
  width: 100%;
  background-color: #222222;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PageColor = styled.div`
  height: 2.5px;
  width: 100%;
  background-color: ${props => props.color};
`;

const Title = styled.h2`
  margin: 0 10px;
`;

class App extends React.Component {
  constructor(props){
    super(props);
    this.pages = [
      <DataQ title={<Title>DataQ</Title>} color={blue} root={this} />,
      <SpotifyQ title={<Title>SpotifyQ</Title>} color={green} root={this} />,
      <BassQ title={<Title>BassQ</Title>} color={green} />
    ];
    this.state = {
      selectedItem: this.pages[0]
    };
  }

  render() {
    return (
      <AppContainer>
        <NotificationContainer />
        <PageColor color={this.state.selectedItem.props.color} />
        <AppHeader>
          <ArraySelector array={this.pages} parent={this} title={this.state.selectedItem.props.title}/>
        </AppHeader>
        <AppBody>
          {this.renderPage()}
        </AppBody>
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

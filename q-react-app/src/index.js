import React from 'react'
import ReactDOM from 'react-dom'
import ApiStatus from './components/ApiAuth'
import DataQ from './pages/DataQ';
import SpotifyQ from './pages/SpotifyQ'
import styled from 'styled-components';
import { LeftArrow, RightArrow } from "./components/styled-components";
import { NotificationContainer } from 'react-notifications';
import { blue, green } from "./colors";
import { moveIndexLeft, moveIndexRight } from "./utils";

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

const PageTitle = styled.h2`
  margin: 0 10px;
`;

const Pages = [
  <DataQ title="DataQ" color={blue} />,
  <SpotifyQ title="SpotifyQ" color={green} />
];

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      currentPageIndex: 0
    };
  }

  render() {
    const currentPage = Pages[this.state.currentPageIndex];
    return (
      <AppContainer>
        <NotificationContainer />
        <PageColor color={currentPage.props.color} />
        <AppHeader>
          <LeftArrow onClick={() => this.movePageLeft()} />
          <PageTitle>{currentPage.props.title}</PageTitle>
          <RightArrow onClick={() => this.movePageRight()} />
          <ApiStatus />
        </AppHeader>
        <AppBody>
          {currentPage}
        </AppBody>
      </AppContainer>
    );
  }

  movePageRight() {
    const nextPageIndex = this.state.currentPageIndex + 1;
    this.setState({
      currentPageIndex: nextPageIndex > Pages.length - 1 ? 0 : nextPageIndex
    })
  }

  movePageLeft() {
    const lastPageIndex = this.state.currentPageIndex - 1;
    this.setState({
      currentPageIndex: lastPageIndex < 0 ? Pages.length - 1 : lastPageIndex
    })

  }
}

ReactDOM.render(<App />, document.getElementById('root'));

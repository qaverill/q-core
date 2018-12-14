import React from 'react'
import ReactDOM from 'react-dom'
import Sidebar from 'react-sidebar'
import Menu from './components/Menu/index'
import ApiStatus from './components/ApiAuth/index'
import DataQ from './components/DataQ/index';
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components';
import { NotificationContainer } from 'react-notifications';

import './app.css'

const AppContainer = styled.div`
  height: 100%;
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

const MenuIcon = styled.img
  .attrs({
    src: require('./components/Menu/menu-icon.png')
  })`
  float: left;
  height: 30px;
  width: 30px;
  cursor: pointer;
  margin-right: auto;
  margin-left: 10px;
`;

const AppBody = styled.div`
  height: calc(100% - 50px);
  background-color: #222222;
  display: flex;
  justify-content: center;
`;

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      sidebarOpen: false,
      currentPage: <DataQ title="DataQ"/>
    };
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    this.setCurrentPage = this.setCurrentPage.bind(this);
  }

  onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open });
  }

  setCurrentPage(page) {
    this.setState({
      currentPage: page,
      sidebarOpen: false
    })
  }

  render() {
    return (
      <Sidebar
        sidebar={<Menu setPage={this.setCurrentPage}/>}
        open={this.state.sidebarOpen}
        onSetOpen={this.onSetSidebarOpen}
      >
        <AppContainer>
          <NotificationContainer />
          <ReactTooltip />
          <AppHeader>
            <MenuIcon onClick={() => this.onSetSidebarOpen(true)} />
            <h3>{this.state.currentPage.props.title}</h3>
            <ApiStatus />
          </AppHeader>
          <AppBody>
            {this.state.currentPage}
          </AppBody>
        </AppContainer>
      </Sidebar>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

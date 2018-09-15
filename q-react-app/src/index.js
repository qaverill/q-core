import React from 'react'
import ReactDOM from 'react-dom'
import Sidebar from 'react-sidebar'
import Menu from './components/Menu'
import ApiStatus from './components/ApiAuth'
import DataQ from "./components/DataQ";

import { NotificationContainer } from 'react-notifications';

import './app.css'

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
        <div id="app">
          <NotificationContainer />
          <div id="app-header" >
            <img id="menu-icon" src={require('./components/Menu/menu-icon.png')} onClick={() => this.onSetSidebarOpen(true)} />
            <h3>{this.state.currentPage.props.title}</h3>
            <ApiStatus />
          </div>
          <div id="app-body">
            {this.state.currentPage}
          </div>
        </div>
      </Sidebar>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

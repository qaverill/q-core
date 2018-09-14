import React from 'react'
import ReactDOM from 'react-dom'
import Sidebar from 'react-sidebar'
import Test from './components/Test/Test'

import { NotificationContainer } from 'react-notifications';

import './App.css'
import './Elements.css'
import './Colors.css'

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      sidebarOpen: true,
      currentPage: <Test title="Test"/>
    };
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }

  onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open });
  }

  render() {
    console.log(this.state.currentPage);
    return (
      <Sidebar
        sidebar={<b>Sidebar content</b>}
        open={this.state.sidebarOpen}
        onSetOpen={this.onSetSidebarOpen}
        styles={{ sidebar: { background: "white" } }}
      >
        <div id="app">
          <NotificationContainer/>
          <img id="menu-icon" src={require('./menu-icon.png')} onClick={() => this.onSetSidebarOpen(true)} />
          <div id="app-header" >
            <h3 id="current-page">{this.state.currentPage.props.title}</h3>
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

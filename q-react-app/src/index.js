import React from 'react'
import ReactDOM from 'react-dom'
import ApiStatus from './components/ApiAuth/index'
import DataQ from './pages/DataQ/index';
import styled from 'styled-components';
import { NotificationContainer } from 'react-notifications';

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

const PageTitle = styled.h3`
  
`

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      currentPage: <DataQ title="DataQ"/>
    };
  }

  render() {
    return (
      <AppContainer>
        <NotificationContainer />
        <AppHeader>
          <h3>{this.state.currentPage.props.title}</h3>
          <ApiStatus />
        </AppHeader>
        <AppBody>
          {this.state.currentPage}
        </AppBody>
      </AppContainer>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

import React from 'react'
import SpotifyQ from '../SpotifyQ/SpotifyQ'
import DataQ from '../DataQ/index'
import styled from 'styled-components';

import spotifyQTheme from '../SpotifyQ/theme.jpg';
import dataQTheme from '../DataQ/theme.jpg';

const theme = {
  SpotifyQ: spotifyQTheme,
  DataQ: dataQTheme
};

const MenuContainer = styled.div`
  background-color: #222222;
  color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const MenuItem = styled.button`
  border: none;
  border-radius: 5px;
  margin: 10px;
  font-size: 24px;
  text-shadow:
  -1px -1px 0 #000,
  1px -1px 0 #000,
  -1px 1px 0 #000,
  1px 1px 0 #000;

  background-size: 300% 100%;
  background-repeat: no-repeat;
  background-position: center;
  filter: brightness(80%);
  
  :hover {
    filter: brightness(100%);
  }

  display: flex;
  justify-content: center;
  flex-grow: 1;
  
  content: ${props => props.content};
  background-image: url(${props => theme[props.content]});
`;

class Menu extends React.Component {
  constructor(props){
    super(props)
  }

  render(){
    return (
      <MenuContainer>
        <MenuItem content="SpotifyQ" onClick={() => this.props.setPage(<SpotifyQ title="SpotifyQ"/>)} />
        <MenuItem content="DataQ" onClick={() => this.props.setPage(<DataQ title="DataQ"/>)} />
      </MenuContainer>
    )
  }
}

export default Menu
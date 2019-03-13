import styled from 'styled-components'
import {dark, medium, white} from "../colors";

export const Button = styled.button`
  border: none;
  color: white;  
  height: 30px;
  padding: 2.5px 7.5px;
  border-radius: 15px;
  margin: 2.5px;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  border: 2px solid black;
  cursor: pointer;
  :focus {
    outline: none;
  }
  background-color: ${props => props.color == null ? medium : props.color};
  :hover {
    filter: brightness(1.25);
  }
`;

export const Text = styled.p`
  font-size: 16px;
  margin: 2.5px;
  color: ${white};
  cursor: default;
  margin: 2.5px;
`;

export const BoldText = styled(Text)`
  font-weight: bold;
`;

export const Header = styled.h1`
  color: white;
  padding: 2.5px;
  height: 25px;
`;

export const TextInput = styled.input`
  font-size: 16px;
  height: 30px;
  padding: 2.5px 7.5px;
  border: 2px solid black;
  border-radius: 15px;
  margin: 2.5px;
  box-sizing: border-box;
  background-color: white;
  color: black;
  :focus {
    outline: none;
    border: 3px solid black;
    padding: 1.5px;
    padding-left: 6.5px;
  }
`;

export const Page = styled.div`
  background-color: ${dark};
  border-radius: 15px;
  padding: 7.5px;
  height: calc(100% - 100px);
  margin 0 25px;
  overflow: auto;
`;

export const RightArrow = styled.img
  .attrs({
    src: require('./Images/arrow.svg')
  })`
  cursor: pointer;
  height: ${props => props.size == null ? `28px` : props.size};
  width: ${props => props.size == null ? `28px` : props.size};
  margin: 2.5px;
  :hover {
    filter: brightness(1.25);
  }
`;

export const LeftArrow = styled(RightArrow)`
  transform: rotate(180deg);
`;

import styled from 'styled-components'
import {dark, medium, light, red, white} from "../colors";

export const Button = styled.button`
  border: none;
  color: white;
  padding: 5px 10px;
  margin: 2.5px;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  cursor: pointer;
  :focus {
    outline: none;
  }
  background-color: ${props => props.color == null ? medium : props.color};
  :hover {
    opacity: 0.8;
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
`;

export const TextInput = styled.input`
  font-size: 16px;
  height: 30px;
  padding: 2.5px;
  border: 2px solid black;
  margin: 2.5px;
  box-sizing: border-box;
  background-color: white;
  color: black;
  :focus {
    outline: none;
    border: 3px solid black;
  padding: 1.5px;
  }
`;

export const SearchBar = styled(TextInput)`
  padding: 5px;
  padding-left: 40px;
  -webkit-border-radius: 50px;
  -moz-border-radius: 50px;
  border-radius: 50px;
`;

export const PageBorder = styled.div`
  height: calc(100% - 10px);
  width: calc(100% - 10px);
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Page = styled.div`
  height: calc(100% - 12.5px);
  width: calc(100% - 12.5px);
  background-color: ${dark};
  padding: 2.5px;
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
    opacity: 0.8;
  }
`;

export const LeftArrow = styled(RightArrow)`
  transform: rotate(180deg);
`;
import styled from 'styled-components'

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
  background-color: ${props => props.color == null ? "#4A483F" : props.color};
  :hover {
    opacity: 0.8;
  }
`;

export const Text = styled.p`
  font-size: 16px;
  margin: 0;
  cursor: default;
`;

export const Header = styled.h1`
  color: white;
`;

export const TextInput = styled.input`
  font-size: 20px;
  padding: 5px;
  border: 2px solid black;
  margin: 8px 0;
  box-sizing: border-box;
  padding-left: 40px;
  background-color: white;
  color: black;
  -webkit-border-radius: 50px;
  -moz-border-radius: 50px;
  border-radius: 50px;
  :focus {
    outline: none;
  }
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
  background-color: #222222;
  padding: 2.5px;
`;

export const RightArrow = styled.img
  .attrs({
    src: require('./SVGs/arrow.svg')
  })`
  cursor: pointer;
  height: ${props => props.size};
  width: ${props => props.size};
  margin: 2.5px;
  :hover {
    opacity: 0.8;
  }
`;

export const LeftArrow = styled(RightArrow)`
  transform: rotate(180deg);
`;
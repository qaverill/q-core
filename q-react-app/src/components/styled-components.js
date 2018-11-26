import styled from 'styled-components'

export const Button = styled.button`
  border: none;
  border-radius: 50px;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  cursor: pointer;
  :focus {
    outline: none;
  }
`;

export const Text = styled.p`
  font-size: 16px;
  margin: 0;
  cursor: default;
`;

export const TextInput = styped.input`
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
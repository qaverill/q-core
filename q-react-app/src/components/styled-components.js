import styled from 'styled-components'

export const Button = styled.button`
  border: none;
  color: black;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  cursor: pointer;
  :focus {
    outline: none;
  }
`;

export const Select = styled.select`

`;

export const Text = styled.p`
  font-size: 16px;
  margin: 0;
  cursor: default;
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
  margin: 10px;
  height: calc(100% - 20px);
  width: 100%;
  background-position: center;
`;

export const Page = styled.div`
  height: calc(100% - 10px);
  width: calc(100% - 10px);
  margin: 5px;
  background-color: #222222;
`;
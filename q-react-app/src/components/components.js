import React from 'react'
import styled from 'styled-components'
import { Header, Page, PageBorder } from './styled-components'
import { RiseLoader } from 'react-spinners'
import { red } from "../colors";

const FullDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const ErrorBorder = styled(PageBorder)`
  background-color: ${red};
`;

export const errorPage = (message) => {
  return (
    <ErrorBorder>
      <Page>
        <FullDiv>
          <img src={require('./SVGs/error-triangle.svg')} />
          <Header>{message}</Header>
        </FullDiv>
      </Page>
    </ErrorBorder>
  )
};

export const loadingSpinner = (message, color) => {
  return (
    <FullDiv>
      <RiseLoader
        sizeUnit={"px"}
        size={100}
        color={color} />
      <Header>{message}</Header>
    </FullDiv>
  )
};

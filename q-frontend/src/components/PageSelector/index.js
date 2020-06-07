import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import styled from 'styled-components';
import { LeftArrow, RightArrow } from '../../packages/core';

const ArraySelectorContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 35px;
`;

const Title = styled.h2`
  margin: 0 10px;
`;

const PageSelector = ({
  idx,
  pages,
  onChange,
}) => {
  const { url } = useRouteMatch();
  const leftIdx = idx + 1 > pages.length - 1 ? 0 : idx + 1;
  const rightIdx = idx - 1 < 0 ? pages.length - 1 : idx - 1;

  function nextLink(nextIdx) {
    const existingUrl = url[url.length - 1] === '/' ? `${url}` : `${url}/`;
    return `${existingUrl}${pages[nextIdx]}`;
  }
  return (
    <ArraySelectorContainer key={pages[idx]}>
      <Link to={nextLink(leftIdx)}>
        <LeftArrow onClick={() => onChange(leftIdx)} />
      </Link>
      <Title>{pages[idx]}</Title>
      <Link to={nextLink(rightIdx)}>
        <RightArrow onClick={() => onChange(rightIdx)} />
      </Link>
    </ArraySelectorContainer>
  );
};

export default PageSelector;

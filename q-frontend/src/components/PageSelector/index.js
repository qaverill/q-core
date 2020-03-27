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
  const match = useRouteMatch();
  const leftIdx = idx + 1 > pages.length - 1 ? 0 : idx + 1;
  const rightIdx = idx - 1 < 0 ? pages.length - 1 : idx - 1;
  return (
    <ArraySelectorContainer key={pages[idx]}>
      <Link to={`${match.url}${pages[leftIdx]}`}>
        <LeftArrow onClick={() => onChange(leftIdx)} />
      </Link>
      <Title>{pages[idx]}</Title>
      <Link to={`${match.url}${pages[rightIdx]}`}>
        <RightArrow onClick={() => onChange(rightIdx)} />
      </Link>
    </ArraySelectorContainer>
  );
};

export default PageSelector;

import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import { LeftArrow, RightArrow } from '../packages/core';
// ----------------------------------
// HELPERS
// ----------------------------------
// ----------------------------------
// STYLES
// ----------------------------------
const ArraySelectorContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-top: 5px;
  margin-bottom: 5px;
`;
const Title = styled.h2`
  margin: 0 10px;
`;
// ----------------------------------
// COMPONENTS
// ----------------------------------
const SlateSelector = ({ idx, pages, onChange }) => {
  const { url } = useRouteMatch();
  const leftIdx = idx + 1 > pages.length - 1 ? 0 : idx + 1;
  const rightIdx = idx - 1 < 0 ? pages.length - 1 : idx - 1;
  const existingUrl = url[url.length - 1] === '/' ? `${url}` : `${url}/`;
  const leftSlateLink = `${existingUrl}${pages[leftIdx]}`;
  const rightSlateLink = `${existingUrl}${pages[rightIdx]}`;
  return (
    <ArraySelectorContainer key={pages[idx]}>
      <Link to={leftSlateLink}>
        <LeftArrow onClick={() => onChange(leftIdx)} />
      </Link>
      <Title>{pages[idx].toUpperCase()}</Title>
      <Link to={rightSlateLink}>
        <RightArrow onClick={() => onChange(rightIdx)} />
      </Link>
    </ArraySelectorContainer>
  );
};

export default SlateSelector;

import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import { LeftArrow, RightArrow, H2, GAP_SIZE } from '../packages/core';
// ----------------------------------
// HELPERS
// ----------------------------------
const getLeftIdx = (idx, array) => (idx + 1 > array.length - 1 ? 0 : idx + 1);
const getRightIdx = (idx, array) => (idx - 1 < 0 ? array.length - 1 : idx - 1);
// ----------------------------------
// STYLES
// ----------------------------------
const ArraySelectorContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: ${GAP_SIZE}px 0px;
`;
const Image = styled.img`
  border-radius: 50%;
  height: 100px;
  width: 100px;
`;
// ----------------------------------
// COMPONENTS
// ----------------------------------
export const SlateSelector = ({ idx, pages, onChange = () => {} }) => {
  const { url } = useRouteMatch();
  const leftIdx = getLeftIdx(idx, pages);
  const rightIdx = getRightIdx(idx, pages);
  const existingUrl = url[url.length - 1] === '/' ? `${url}` : `${url}/`;
  const leftSlateLink = `${existingUrl}${pages[leftIdx]}`;
  const rightSlateLink = `${existingUrl}${pages[rightIdx]}`;
  return (
    <ArraySelectorContainer key={pages[idx]}>
      <Link to={leftSlateLink}>
        <LeftArrow onClick={() => onChange(leftIdx)} />
      </Link>
      <H2>{pages[idx].toUpperCase()}</H2>
      <Link to={rightSlateLink}>
        <RightArrow onClick={() => onChange(rightIdx)} />
      </Link>
    </ArraySelectorContainer>
  );
};

export const ImageSelector = ({ idx, images, onChange = () => {} }) => {
  const leftIdx = getLeftIdx(idx, images);
  const rightIdx = getRightIdx(idx, images);
  return (
    <ArraySelectorContainer key={images[idx]}>
      <LeftArrow onClick={() => onChange(leftIdx)} />
      <Image src={images[idx]} alt={images[idx]} />
      <RightArrow onClick={() => onChange(rightIdx)} />
    </ArraySelectorContainer>
  );
};

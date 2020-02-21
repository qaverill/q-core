import React from 'react';
import styled from 'styled-components';
import { LeftArrow, RightArrow } from '../../packages/core';

const ArraySelectorContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 35px;
`;

const ArraySelector = ({
  title,
  saveIdx,
  idx,
  array,
}) => {
  const clickLeft = () => saveIdx(idx + 1 > array.length - 1 ? 0 : idx + 1);
  const clickRight = () => saveIdx(idx - 1 < 0 ? array.length - 1 : idx - 1);
  return title.props.children ? (
    <ArraySelectorContainer key={title}>
      <LeftArrow onClick={clickLeft} />
      {title || 'FFF'}
      <RightArrow onClick={clickRight} />
    </ArraySelectorContainer>
  ) : null;
};

export default ArraySelector;

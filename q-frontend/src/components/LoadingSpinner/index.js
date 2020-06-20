import React from 'react';
import { ClipLoader } from 'react-spinners';
import { FullDiv, H2 } from '../../packages/core';

const LoadingSpinner = ({ color, message }) => (
  <FullDiv>
    <ClipLoader sizeUnit="px" size={100} color={color} />
    <H2>{message}</H2>
  </FullDiv>
);

export default LoadingSpinner;

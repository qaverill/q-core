import React from 'react';
import { ClipLoader } from 'react-spinners';
import { green } from '../packages/colors';
import { FullDiv } from '../packages/core';

const WaitSpinner = ({ color }) => {
  return (
    <FullDiv>
      <ClipLoader sizeUnit="px" size={100} color={color || green} />
    </FullDiv>
  );
};

export default WaitSpinner;

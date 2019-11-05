import { ClipLoader } from 'react-spinners';
import { FullDiv } from '@q/core';

const LoadingSpinner = props => {
  const { color, message } = props;
  return (
    <FullDiv>
      <ClipLoader sizeUnit="px" size={100} color={color} />
      <h2>{message}</h2>
    </FullDiv>
  );
}

export default LoadingSpinner;
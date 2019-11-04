import { ClipLoader } from 'react-spinners';
import { q_styledComponents } from 'q-lib'

const { FullDiv } = q_styledComponents;

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

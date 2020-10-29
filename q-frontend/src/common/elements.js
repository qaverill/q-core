/* eslint-disable import/no-extraneous-dependencies */
import styled from 'styled-components';
import * as R from 'ramda';
import arrow from '../images/arrow.svg';
import settingsGear from '../images/settings-gear.svg';
import {
  dark,
  medium,
  white,
  yellow,
} from './colors';
// ----------------------------------
// CONSTANTS
// ----------------------------------
export const DROP_SIZE = 40;
export const GAP_SIZE = 5;
const MARGIN = GAP_SIZE * 4;
// ----------------------------------
// TEXT
// ----------------------------------
export const H2 = styled.h2`
  color: white;
  margin: ${GAP_SIZE}px;
`;
export const H3 = styled.h3`
  color: white;
  margin: ${GAP_SIZE}px;
`;
export const Text = styled.p`
  font-size: 16px;
  margin: 2.5px;
  color: ${props => (props.color == null ? white : props.color)};
  cursor: default;
  margin: 2.5px;
`;
export const BoldText = styled(Text)`
  font-weight: bold;
`;
export const Title = styled(H2)`
  margin: 0 10px;
`;
// ----------------------------------
// INTERACTIONS
// ----------------------------------
export const Button = styled.button`
  color: ${props => (props.color === yellow ? dark : white)};  
  height: 30px;
  padding: 2.5px 7.5px;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  border: 2px solid black;
  border-radius: 15px;
  :focus {
    outline: none;
  }
  background-color: ${props => (props.color == null ? medium : props.color)};
  ${props => (R.isNil(props.clickable) || props.clickable) && (
    'cursor: pointer; :hover { filter: brightness(1.25); };'
  )}
`;
export const TextInput = styled.input`
  font-size: 16px;
  height: 30px;
  padding: 2.5px 7.5px;
  border: 2px solid black;
  border-radius: 15px;
  margin: 2.5px;
  box-sizing: border-box;
  background-color: white;
  color: black;
  :focus {
    outline: none;
    border: 3px solid black;
    padding: 1.5px;
    padding-left: 6.5px;
  }
`;
// ----------------------------------
// CONTAINERS
// ----------------------------------
export const Slate = styled.div`
  background-color: ${dark};
  border: ${GAP_SIZE}px solid ${props => props.rimColor};
  border-radius: 15px 15px 0px 0px;
  height: calc(100% - ${props => DROP_SIZE + (GAP_SIZE * (props.isFirst ? 2 : 1)) + MARGIN}px);
  margin: 0px ${MARGIN}px ${MARGIN}px ${MARGIN}px;
`;
export const SlateContent = styled.div`
  height: calc(100% - ${props => props.drops * DROP_SIZE}px);
`;
// ----------------------------------
// IMAGES
// ----------------------------------
export const RightArrow = styled.img
  .attrs({
    src: arrow,
  })`
  cursor: pointer;
  height: ${props => (props.size == null ? '20px' : props.size)};
  width: ${props => (props.size == null ? '20px' : props.size)};
  margin: 2.5px;
  :hover {
    filter: brightness(1.25);
  }
`;
export const LeftArrow = styled(RightArrow)`
  transform: rotate(180deg);
`;
export const SettingsGear = styled.img
  .attrs({
    src: settingsGear,
  })`
  cursor: pointer;
  height: ${props => (props.size == null ? '28px' : props.size)};
  width: ${props => (props.size == null ? '28px' : props.size)};
  margin: 2.5px;
  :hover {
    filter: brightness(1.25);
  }
`;

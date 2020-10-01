import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { ImageSelector } from '../../../../components/Selectors';
import off from './images/off.jpg';
import purplegreen from './images/purplegreen.jpg';
import white from './images/white.jpg';
import Modes from './modes.json';
import { setAllLightsToColor } from '../../../../api/lifx';
// ----------------------------------
// HELPERS
// ----------------------------------
const MODE_NAMES = Object.keys(Modes);
const MODE_IMAGES = [white, purplegreen, off]; // THIS MUST MATCH ORDER OF modes.json
const OFF_IDX = MODE_IMAGES.indexOf(off);
const normalize = listOfObjects => listOfObjects.map(JSON.stringify).sort();
// ----------------------------------
// STYLES
// ----------------------------------
// ----------------------------------
// LOGIC
// ----------------------------------
const determineCurrentModeIdx = lights => {
  const allLightsOn = lights.every(light => light.power === 'on');
  const allLightsOff = lights.every(light => light.power === 'off');
  if (allLightsOff) return OFF_IDX;
  const colors = lights.map(R.prop('color'));
  return MODE_NAMES
    .map((mode, idx) => (R.equals(normalize(Modes[mode]), normalize(colors)) && allLightsOn ? idx : null))
    .filter(i => i != null)[0];
};
// ----------------------------------
// COMPONENTS
// ----------------------------------
const ModeSelector = ({ lights }) => {
  console.log(lights)
  const [modeIdx, setModeIdx] = React.useState(determineCurrentModeIdx(lights));
  const changeMode = (idx) => {
    setModeIdx(idx);
    setAllLightsToColor(Modes[MODE_NAMES[idx]]);
  };
  return (
    <div>
      <ImageSelector idx={modeIdx} images={MODE_IMAGES} onChange={changeMode} />
    </div>
  );
};
export default ModeSelector;

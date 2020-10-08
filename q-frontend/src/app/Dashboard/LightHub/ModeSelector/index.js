import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { ImageSelector } from '../../../../components/Selectors';
import off from './images/off.jpg';
import unknown from './images/unknown.png';
import purplegreen from './images/purplegreen.jpg';
import white from './images/white.jpg';
import Modes from './modes.json';
import { setAllLightsToColor, turnAllLightsOff } from '../../../../api/lifx';
// ----------------------------------
// HELPERS
// ----------------------------------
const MODE_NAMES = ['white', 'purplegreen', 'off', 'unknown'];
const MODE_IMAGES = [white, purplegreen, off, unknown]; // THIS MUST MATCH ORDER OF modes.json
const OFF_IDX = MODE_NAMES.indexOf('off');
const UNKNOWN_IDX = MODE_NAMES.indexOf('unknown');
const normalize = listOfObjects => listOfObjects.map(JSON.stringify).sort();
// ----------------------------------
// STYLES
// ----------------------------------
// ----------------------------------
// LOGIC
// ----------------------------------
const determineCurrentModeIdx = lights => {
  const allLightsOff = lights.every(light => light.power === 'off');
  if (allLightsOff) return OFF_IDX;
  const colors = lights.map(R.prop('color'));
  const currentModeIdx = MODE_NAMES
    .map((mode, idx) => (R.equals(normalize(Modes[mode]), normalize(colors)) ? idx : null))
    .filter(i => i != null)[0];
  return currentModeIdx || UNKNOWN_IDX;
};

// ----------------------------------
// COMPONENTS
// ----------------------------------
const ModeSelector = ({ lights }) => {
  const [modeIdx, setModeIdx] = React.useState(determineCurrentModeIdx(lights));
  const changeMode = (idx) => {
    setModeIdx(idx);
    setAllLightsToColor(Modes[MODE_NAMES[idx]]);
  };
  const turnAllLightsOffAndChangeIdx = () => {
    turnAllLightsOff();
    setModeIdx(OFF_IDX);
  };
  console.log(lights)
  return (
    <div>
      <ImageSelector
        idx={modeIdx}
        images={MODE_IMAGES}
        onChange={changeMode}
        skips={[UNKNOWN_IDX]}
        onImageClick={turnAllLightsOffAndChangeIdx}
      />
    </div>
  );
};
export default ModeSelector;

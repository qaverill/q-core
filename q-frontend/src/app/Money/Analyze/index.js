import * as React from 'react';
import styled from 'styled-components';
import { Switch, Redirect, Route } from 'react-router-dom';
import BiMonthlyAnalysis from './BiMonthlyAnalysis';
import Overview from './Overview';
import { Slate, SlateContent } from '../../../packages/core';
import { moneyTheme } from '../../../packages/colors';
import { SlateSelector } from '../../../components/Selectors';
// ----------------------------------
// HELPERS
// ----------------------------------
const SLATE_FEATURES = ['biMonthlyAnalysis', 'overview'];
// ----------------------------------
// STYLES
// ----------------------------------
const AnalyzeSlate = styled(Slate)`
  display: flex;
  flex-direction: column;
`;
// ----------------------------------
// COMPONENTS
// ----------------------------------
const Analyze = () => {
  const [analysisIdx, setAnalysisIdx] = React.useState(0);
  function setAnalysis(idx) {
    setAnalysisIdx(idx);
  }
  return (
    <AnalyzeSlate rimColor={moneyTheme.secondary}>
      <SlateContent drops={1}>
        <SlateSelector pages={SLATE_FEATURES} idx={analysisIdx} onChange={setAnalysis} />
        <Switch>
          <Route exact path="/money/analyze" render={() => <Redirect exact to={`/money/analyze/${SLATE_FEATURES[analysisIdx]}`} />} />
          <Route exact path="/money/analyze/biMonthlyAnalysis">
            <BiMonthlyAnalysis />
          </Route>
          <Route exact path="/money/analyze/Overview">
            <Overview />
          </Route>
        </Switch>
      </SlateContent>
    </AnalyzeSlate>
  );
};

export default Analyze;

export const selectSettings = state => {
  if (state == null) return null;
  return state.settings;
};

export const selectMusicStore = ({ musicFilters }) => musicFilters;

export const selectMoneyStore = ({ moneyFilters }) => moneyFilters;

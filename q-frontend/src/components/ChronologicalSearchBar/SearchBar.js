/* eslint-disable no-undef */
import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
// TODO: no
import './theme.css';

const SearchBar = ({ setFilter, search }) => {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const onChange = (event, { newValue }) => setValue(newValue);

  const onBlur = () => { if (suggestions.length === 0 && value === '') setFilter(null); };

  const onSuggestionSelected = (event, { suggestion }) => setFilter(suggestion.filter, suggestion.type);

  const onSuggestionsFetchRequested = ({ value: searchString }) => {
    if (searchString === '') setSuggestions([]);
    search(searchString).then(setSuggestions);
  };

  const onSuggestionsClearRequested = () => setSuggestions([]);

  const getSuggestionValue = (suggestion) => `${suggestion.name} (${suggestion.type})`;

  const renderSuggestion = suggestion => <div>{`${suggestion.name} - ${suggestion.type}`}</div>;

  const inputProps = {
    placeholder: 'No Filter',
    value,
    onChange,
    onBlur,
  };

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      onSuggestionSelected={onSuggestionSelected}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
    />
  );
};

export default SearchBar;

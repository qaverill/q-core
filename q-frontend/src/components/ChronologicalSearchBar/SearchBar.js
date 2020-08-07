/* eslint-disable no-undef */
import React, { useState } from 'react';
import _ from 'lodash';
import Autosuggest from 'react-autosuggest';
// TODO: no
import './theme.css';

const SearchBar = ({ setFilter, fetchData }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [, setSearchQuery] = useState({});

  function onChange(e, { newValue }) {
    setQuery(newValue);
  }

  function onBlur() {
    if (suggestions.length === 0 && query === '') setFilter(null);
  }

  function onSuggestionSelected(e, { suggestion }) {
    setFilter(suggestion.filter, suggestion.type);
  }

  async function sendQuery(value) {
    const { cancelPrevQuery, result } = await fetchData(value);
    if (cancelPrevQuery) return;
    setSuggestions(result);
  }

  function onSuggestionsFetchRequested({ value }) {
    if (value === '') setSuggestions([]);
    setQuery(value);

    const search = _.debounce(sendQuery, 500);

    setSearchQuery(prevSearch => {
      if (prevSearch.cancel) prevSearch.cancel();
      return search;
    });

    search(value);
  }

  function onSuggestionsClearRequested() {
    setSuggestions([]);
  }

  function getSuggestionValue(suggestion) {
    return `${suggestion.name} (${suggestion.type})`;
  }

  function renderSuggestion(suggestion) {
    return <div>{`${suggestion.name} - ${suggestion.type}`}</div>;
  }

  const inputProps = {
    placeholder: 'No Filter',
    value: query,
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

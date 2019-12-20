/* eslint-disable no-undef */
import React from 'react';
import styled from 'styled-components';
import Autosuggest from 'react-autosuggest';
import './theme.css';

const people = [
  {
    name: 'Thundercat',
    filter: '4frXpPxQQZwbCu3eTGnZEw',
    type: 'artist'
  },
  {
    name: 'Thunderstruck',
    filter: '57bgtoPSgt236HzfBOd8kj',
    type: 'track'
  },
  {
    name: 'Flying Lotus',
    filter: '29XOeO6KIWxGthejQqn793',
    type: 'artist'
  },
  { name: 'Flying Microtonal Banana',
    filter: '4G9ANFGk9579p2uirMbVT0',
    type: 'album'  
  }
];

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions(value) {
  const escapedValue = escapeRegexCharacters(value.trim());
  
  if (escapedValue === '') {
    return [];
  }

  const regex = new RegExp('\\b' + escapedValue, 'i');
  
  return people.filter(person => regex.test(getSuggestionValue(person)));
}

function getSuggestionValue(suggestion) {
  return `${suggestion.name}`;
}

const renderSuggestion = suggestion => (
  <div>
    {`${suggestion.name} - ${suggestion.type}`}
  </div>
);

class SearchBar extends React.Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: []
    };    
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  onBlur = (event, { suggestion }) => {
    const { parent } = this.props;
    const { filter } = suggestion
    parent.setState({ filter })
  }
  
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;

    const inputProps = {
      placeholder: 'Filter Data',
      value,
      onChange: this.onChange,
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        onSuggestionSelected={this.onBlur}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}

export default SearchBar;

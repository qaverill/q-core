/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Autosuggest from 'react-autosuggest';
import './theme.css';

const stringSimilarity = require('string-similarity');

function getSuggestionValue(suggestion) {
  return `${suggestion.name} (${suggestion.type})`;
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

  onChange = (event, { newValue: value }) => {
    this.setState({ value });
  };

  onBlur = () => {
    const { suggestions, value } = this.state;
    if (suggestions.length == 0 && value === '') {
      const { parent } = this.props;
      parent.setState({ filter: null })
    }
  }

  onSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    const { parent } = this.props;
    const { filter } = suggestion
    parent.setState({ filter })
  }
  
  onSuggestionsFetchRequested = ({ value, reason }) => {
    if (value === '') {
      this.setState({ suggestions: [] });
    }
    const _this = this;
    const types = ['track', 'artist', 'album'];
    axios.get('/spotify', { params: { url: `https://api.spotify.com/v1/search?q=${value}&type=track,artist,album&limit=3` } })
      .then(res => {
        _this.setState({
          suggestions: types
            .map(type => (
              res.data[`${type}s`].items.map(item => ({
                name: item.name,
                filter: item.id,
                confidence: stringSimilarity.compareTwoStrings(item.name, value),
                type,
              }))
            ))
            .flat()
            .filter(item => item.confidence > 0.5)
            .sort((a, b) => b.confidence - a.confidence)
        })
      }).catch(error => console.log(error));
  };

  onSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] });
  };

  render() {
    const { value, suggestions } = this.state;

    const inputProps = {
      placeholder: 'No Filter',
      value,
      onChange: this.onChange,
      onBlur: this.onBlur
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        onSuggestionSelected={this.onSuggestionSelected}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}

export default SearchBar;

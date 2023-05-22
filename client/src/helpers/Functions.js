export const getSuggestions = (value, breeds) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0
    ? []
    : breeds.filter(breed => breed.name.toLowerCase().includes(inputValue));
};

export const getSuggestionValue = suggestion => suggestion.name;

export const renderSuggestion = suggestion => <div>{suggestion.name}</div>;

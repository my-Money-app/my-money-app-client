import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { Box, Paper, Button, TextField, Typography } from '@mui/material';

export default function OutcomeDetails({ outcome }) {
  const [value, setValue] = useState(0);
  const [valueToIncrease, setValueToIncrease] = useState(0);

  const [suggestions, setSuggestions] = useState([]);
  const [suggestionToAdd, setSuggestionToAdd] = useState([]);

  const [deleteButtonIndex, setDeleteButtonIndex] = useState(null); // Index of suggestion with visible delete button

  const handleIncreaseValue = () => {
    // Increase the value
    setValue(value + Number(valueToIncrease));
  };

  const handleAddSuggestion = () => {
    // Add a new suggestion
    setSuggestions([...suggestions, suggestionToAdd]);
  };

  const handleSuggestionRightClick = (index, event) => {
    // Handle right-click on suggestion
    event.preventDefault();
    console.log(`Right-clicked on suggestion ${index}`);
    setDeleteButtonIndex(index); // Show delete button for this suggestion
  };

  const handleSuggestionLongPress = (index) => {
    // Handle long press on suggestion
    console.log(`Long press on suggestion ${index}`);
    setDeleteButtonIndex(index); // Show delete button for this suggestion
  };

  const handleDeleteSuggestion = () => {
    // Handle delete suggestion button click
    const updatedSuggestions = [...suggestions];
    updatedSuggestions.splice(deleteButtonIndex, 1);
    setSuggestions(updatedSuggestions);
    setDeleteButtonIndex(null); // Hide delete button after deletion
  };

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        outcome1
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 4,
          height: '10vh', // Adjusted height to fit content
        }}
      >
        <Typography variant="h3">{value} TND</Typography>
      </Box>
      <TextField
        label="Increase Value"
        type="number"
        value={valueToIncrease}
        onChange={(e) => setValueToIncrease(e.target.value)}
        fullWidth
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        sx={{ marginBottom: 2 }}
      />
      <Button onClick={handleIncreaseValue} variant="contained" sx={{ mb: 2 }}>
        Increase
      </Button>
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 6 }}>
        Suggestions:
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap', // Allow suggestions to wrap to the next line
          gap: 4, // Add gap between suggestions
          mt: 1, // Adjust margin top
        }}
      >
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            style={{
              position: 'relative', // Make the container relative for absolute positioning of delete button
              width: 'auto',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#f0f0f0',
              padding: '10px',
              cursor: 'pointer', // Change cursor to pointer
            }}
            onContextMenu={(event) => handleSuggestionRightClick(index, event)} // Handle right-click
            onTouchStart={() => handleSuggestionLongPress(index)} // Handle long press
            
          >
            {suggestion} TND
            {/* Conditionally render delete button */}
            {deleteButtonIndex === index && (
              <Button
                style={{ position: 'absolute', top: '-30px', right: '-30px' }} // Position delete button
                variant="outlined"
                color="error"
                size="small"
                onClick={handleDeleteSuggestion}
              >
                Delete
              </Button>
            )}
          </div>
        ))}
      </Box>
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
        Add a suggestion:
      </Typography>
      <TextField
        label="Suggestion"
        type="number"
        value={suggestionToAdd}
        onChange={(e) => setSuggestionToAdd(e.target.value)}
        fullWidth
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        sx={{ marginBottom: 2 }}
      />
      <Button onClick={handleAddSuggestion} variant="contained">
        Add
      </Button>
    </Paper>
  );
}

OutcomeDetails.propTypes = {
  outcome: PropTypes.shape({
    name: PropTypes.any,
    value: PropTypes.any,
    suggestions: PropTypes.arrayOf(PropTypes.any),
  }),
};

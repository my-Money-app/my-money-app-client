import axios from 'axios';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { Box, Grid, Paper, Button, TextField, Typography } from '@mui/material';

import AppCurrentVisits from '../overview/app-current-visits';

export default function OutcomeDetails() {
  const { theOutcomeId } = useParams();
  const [outcome, setOutcome] = useState();
  const [outcomesSum, setOutcomesSum] = useState();
  const getOutcome = async (outcomeId) => {
    try {
      // Make a GET request to the API endpoint with the outcomeId parameter
      console.log(outcomeId);
      const response = await axios.get(`http://localhost:3120/outcomes/outcome/${outcomeId}`);

      // Check if the outcome was successfully retrieved
      if (response.status === 200) {
        // Return the outcome data
        setOutcome(response.data);
        setSuggestions(response.data.suggestions);
        console.log(response.data);
      }
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error('Error getting outcome:', error);
      // Return null if an error occurred
    }
  };

  const getOutcomesSum = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      // Make a GET request to your backend API to fetch the sum of outcomes for the user
      const response = await axios.get(`http://localhost:3120/dashboard/sum/${userId}`, {
        headers: {
          Authorization: `${token}`, // Include the token in the Authorization header
        },
        iid: userId,
      });

      // Check if the request was successful
      if (response.status === 200) {
        // Return the sum from the response data
        setOutcomesSum(response.data);
      } else {
        console.error('Failed to fetch outcomes sum:', response.data);
      }
    } catch (error) {
      console.error('Error fetching outcomes sum:', error);
    }
  };

  useEffect(() => {
    getOutcome(theOutcomeId);
    getOutcomesSum();
  }, [theOutcomeId]);
  const [valueToIncrease, setValueToIncrease] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionToAdd, setSuggestionToAdd] = useState([]);

  const [deleteButtonIndex, setDeleteButtonIndex] = useState(null); // Index of suggestion with visible delete button

  const handleIncreaseValue = async (type) => {
    // Increase the value
    if (type === 'plus') {
      try {
        // Send a PUT request to the API to increase the outcome value
        const response = await axios.put(
          `http://localhost:3120/outcomes/${theOutcomeId}/increase`,
          {
            increaseValue: valueToIncrease,
          }
        );

        // Check if the increase was successful
        if (response.status === 200) {
          // Outcome value increased successfully
          console.log('Outcome value increased successfully:', response.data.message);
          window.location.reload();
        } else {
          // Handle error response if needed
          console.error('Failed to increase outcome value:', response.data.error);
        }
      } catch (error) {
        // Handle any errors that occur during the API call
        console.error('Error increasing outcome value:', error);
      }
    } else if (outcome && type === 'minus' && outcome.value - valueToIncrease >= 0) {
      try {
        // Send a PUT request to the API to increase the outcome value
        const response = await axios.put(
          `http://localhost:3120/outcomes/${theOutcomeId}/increase`,
          {
            increaseValue: -valueToIncrease,
          }
        );

        // Check if the increase was successful
        if (response.status === 200) {
          // Outcome value increased successfully
          console.log('Outcome value increased successfully:', response.data.message);
          window.location.reload();
        } else {
          // Handle error response if needed
          console.error('Failed to increase outcome value:', response.data.error);
        }
      } catch (error) {
        // Handle any errors that occur during the API call
        console.error('Error increasing outcome value:', error);
      }
    } else {
      alert("outcom can't be negative");
    }
  };
  const addSuggestion = async () => {
    try {
      // Send a POST request to the API to add the suggestion
      const response = await axios.post(
        `http://localhost:3120/outcomes/${theOutcomeId}/suggestions`,
        {
          value: suggestionToAdd,
        }
      );

      // Check if the suggestion was added successfully
      if (response.status === 200) {
        // Suggestion added successfully, you can handle any further actions here
        console.log('Suggestion added successfully:', response.data);
        window.location.reload();
      } else {
        // Handle error response if needed
        console.error('Failed to add suggestion:', response.data);
      }
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error('Error adding suggestion:', error);
    }
  };
  const deleteSuggestion = async (suggestionIndex) => {
    try {
      // Send a DELETE request to the API to delete the suggestion
      const response = await axios.delete(
        `http://localhost:3120/outcomes/${theOutcomeId}/suggestions/${suggestionIndex}`
      );

      // Check if the suggestion was deleted successfully
      if (response.status === 200) {
        // Suggestion deleted successfully, you can handle any further actions here
        console.log('Suggestion deleted successfully:', response.data);
        window.location.reload();
      } else {
        // Handle error response if needed
        console.error('Failed to delete suggestion:', response.data);
      }
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error('Error deleting suggestion:', error);
    }
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

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h3" color="red" gutterBottom>
        {outcome?.name}
      </Typography>
      <Grid>
        {outcome?.value > 0 && (
          <AppCurrentVisits
            title={`How much is "${outcome?.name}" of all my outcomes`}
            chart={{
              series: [
                {
                  label: outcome ? outcome.name : 'loading...',
                  value: outcome ? outcome.value : 0,
                },
                { label: 'the rest of outcomes', value: outcome ? outcomesSum - outcome.value : 0 },
              ],
            }}
          />
        )}
      </Grid>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 4,
          height: '10vh', // Adjusted height to fit content
        }}
      >
        <Typography variant="h3">{outcome?.value.toFixed(3)} TND</Typography>
      </Box>
      <TextField
        label=" Value"
        type="number"
        onChange={(e) => setValueToIncrease(e.target.value)}
        fullWidth
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        sx={{ marginBottom: 2 }}
      />
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
        <Button onClick={() => handleIncreaseValue('plus')} variant="contained" sx={{ mb: 2 }}>
          Increase
        </Button>
        <Button
          onClick={() => handleIncreaseValue('minus')}
          variant="contained"
          sx={{ mb: 2, backgroundColor: 'gray' }}
        >
          Decrease
        </Button>
      </div>
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
              <div style={{ position: 'absolute', top: '-30px', right: '-30px' }}>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => deleteSuggestion(index)}
                >
                  Delete
                </Button>
              </div>
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
      <Button onClick={addSuggestion} variant="contained">
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

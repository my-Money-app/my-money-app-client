import axios from 'axios';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { Box, Grid, Paper, Button, TextField, Typography } from '@mui/material';

import MessageModal from '../messages/MessageModel';
import LoadingComponent from '../overview/loading/Loading';
import AppCurrentVisits from '../overview/app-current-visits';

export default function OutcomeDetails() {
  const { theOutcomeId } = useParams();
  const [outcome, setOutcome] = useState();
  const [outcomesSum, setOutcomesSum] = useState();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageModal, setMessageModal] = useState(false);
  const getOutcome = async (outcomeId, token) => {
    try {
      setLoading(true);
      // Make a GET request to the API endpoint with the outcomeId parameter
      const response = await axios.get(
        `https://my-money-aoo.onrender.com/outcomes/outcome/${outcomeId}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      // Check if the outcome was successfully retrieved
      if (response.status === 200) {
        // Return the outcome data
        setOutcome(response.data);
        setSuggestions(response.data.suggestions);
        setLoading(false);
      }
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error('Error getting outcome:', error);
      setMessage('Error getting outcome');
      setMessageModal(true);
      // Return null if an error occurred
    }
  };

  const getOutcomesSum = async () => {
    const token = localStorage.getItem('token');
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');

      // Make a GET request to your backend API to fetch the sum of outcomes for the user
      const response = await axios.get(
        `https://my-money-aoo.onrender.com/dashboard/sum/${userId}`,
        {
          headers: {
            Authorization: `${token}`, // Include the token in the Authorization header
          },
          iid: userId,
        }
      );

      // Check if the request was successful
      if (response.status === 200) {
        // Return the sum from the response data
        setOutcomesSum(response.data);
        setLoading(false);
      } else {
        console.error('Failed to fetch outcomes sum:', response.data);
        setMessage('Failed to fetch outcomes sum');
        setMessageModal(true);
      }
    } catch (error) {
      console.error('Error fetching outcomes sum:', error);
    }
  };
  const retrivedToken = localStorage.getItem('token');
  useEffect(() => {
    getOutcome(theOutcomeId, retrivedToken);
    getOutcomesSum();
  }, [theOutcomeId, retrivedToken]);
  const [ToIncrease, setValueToIncrease] = useState();
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionToAdd, setSuggestionToAdd] = useState([]);

  const [deleteButtonIndex, setDeleteButtonIndex] = useState(null); // Index of suggestion with visible delete button

  const handleIncreaseValue = async (type, valueToIncrease, token) => {
    if (valueToIncrease && valueToIncrease < 0) {
      alert('Please add a positive & valid value');
    } else if (type === 'plus') {
      try {
        setLoading(true);
        const response = await axios.put(
          `https://my-money-aoo.onrender.com/outcomes/${theOutcomeId}/increase`,
          {
            increaseValue: valueToIncrease,
          },
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (response.status === 200) {
          setLoading(false);
          setMessage('Outcome value increased successfully');
          setMessageModal(true);
          getOutcome(theOutcomeId, retrivedToken);
          getOutcomesSum();

          // window.location.reload();
        } else {
          setLoading(false);

          console.error('Failed to increase outcome value:', response.data.error);
          setMessage('Failed to increase outcome valu!');
          setMessageModal(true);
        }
      } catch (error) {
        if (error.response.status === 395) {
          setLoading(false);

          setMessage(error.response.data.error);
          setMessageModal(true);
        } else {
          setLoading(false);

          console.error('Error increasing outcome value:', error);
          setMessage('Error increasing outcome value');
          setMessageModal(true);
        }
      }
    } else if (outcome && type === 'minus' && outcome.value - valueToIncrease >= 0) {
      try {
        setLoading(true);
        const response = await axios.put(
          `https://my-money-aoo.onrender.com/outcomes/${theOutcomeId}/increase`,
          {
            increaseValue: -valueToIncrease,
          },
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (response.status === 200) {
          setLoading(false);
          setMessage('Outcome value increased successfully');
          setMessageModal(true);
          getOutcome(theOutcomeId, retrivedToken);
          getOutcomesSum();
        } else {
          setLoading(false);
          setMessage('Failed to increase outcome value');
          setMessageModal(true);
          console.error('Failed to increase outcome value:', response.data.error);
        }
      } catch (error) {
        setLoading(false);
        setMessage('Error increasing outcome value');
        setMessageModal(true);
        console.error('Error increasing outcome value:', error);
      }
    } else {
      setLoading(false);
      setMessage("Outcome value can't be negative");
      setMessageModal(true);
    }
  };

  const addSuggestion = async (token) => {
    if (suggestionToAdd < 0) {
      alert('please add a positive value');
    } else {
      try {
        // Send a POST request to the API to add the suggestion
        setLoading(true);

        const response = await axios.post(
          `https://my-money-aoo.onrender.com/outcomes/${theOutcomeId}/suggestions`,
          {
            value: suggestionToAdd,
          },
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        // Check if the suggestion was added successfully
        if (response.status === 200) {
          setLoading(false);
          setMessage('Suggestion added successfully');
          getOutcome(theOutcomeId, retrivedToken);
        } else {
          setLoading(false);
          setMessage('Failed to add suggestion');
          setMessageModal(true);
          // Handle error response if needed
          console.error('Failed to add suggestion:', response.data);
        }
      } catch (error) {
        setLoading(false);
        if (error.response.status === 400) {
          setMessage('suggesstion already exists');
          setMessageModal(true);
          setSuggestionToAdd(0);
        }
        setMessage('Error adding suggestion');
        setMessageModal(true);
        // Handle any errors that occur during the API call
        console.error('Error adding suggestion:', error);
      }
    }
  };
  const IncreaseBySuggesstion = (suggesstion) => {
    handleIncreaseValue('plus', suggesstion, retrivedToken);
  };

  const deleteSuggestion = async (suggestionIndex, token) => {
    const confirmed = window.confirm('Are you sure you want to delete this suggestion?');

    if (confirmed) {
      try {
        setLoading(true);
        // Send a DELETE request to the API to delete the suggestion
        const response = await axios.delete(
          `https://my-money-aoo.onrender.com/outcomes/${theOutcomeId}/suggestions/${suggestionIndex}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        // Check if the suggestion was deleted successfully
        if (response.status === 200) {
          // Suggestion deleted successfully, you can handle any further actions here
          setMessage('Suggestion deleted successfully');
          setMessageModal(true);
          getOutcome(theOutcomeId, retrivedToken);
        } else {
          // Handle error response if needed
          setMessage('Failed to delete suggestion');
          setMessageModal(true);
          console.error('Failed to delete suggestion:', response.data);
        }
      } catch (error) {
        // Handle any errors that occur during the API call
        console.error('Error deleting suggestion:', error);
      }
    }
    setDeleteButtonIndex(null);
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

  return loading ? (
    <LoadingComponent />
  ) : (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h3" color="red" gutterBottom>
        {outcome?.name}
      </Typography>
      <Grid>
        {outcome?.value > 0 && (
          <AppCurrentVisits
            title={`How much is "${outcome?.name}" of all my spendings`}
            chart={{
              series: [
                {
                  label: outcome ? outcome.name : 'loading...',
                  value: outcome ? outcome.value : 0,
                },
                {
                  label: 'the rest of Spendings',
                  value: outcome ? outcomesSum - outcome.value : 0,
                },
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
        label=" Value in TND"
        type="number"
        onChange={(e) => setValueToIncrease(e.target.value)}
        fullWidth
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        sx={{ marginBottom: 2 }}
      />
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
        <Button
          onClick={() => handleIncreaseValue('plus', ToIncrease, retrivedToken)}
          variant="contained"
          sx={{ mb: 2 }}
        >
          Increase
        </Button>
        <Button
          onClick={() => handleIncreaseValue('minus', ToIncrease, retrivedToken)}
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
          gap: 6, // Add gap between suggestions
          mt: 1, // Adjust margin top
          mr: 3,
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
              marginBottom: '10%',
            }}
            onContextMenu={(event) => handleSuggestionRightClick(index, event)} // Handle right-click
            onTouchStart={() => handleSuggestionLongPress(index)} // Handle long press
          >
            {suggestion} TND
            {/* Conditionally render delete button */}
            {deleteButtonIndex === index && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '-35px',
                  right: '-30px',
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <Button
                  variant="outlined"
                  color="inherit"
                  size="small"
                  onClick={() => IncreaseBySuggesstion(suggestion)}
                >
                  Add
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => deleteSuggestion(index, retrivedToken)}
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
        label="Suggestion in TND"
        type="number"
        value={suggestionToAdd}
        onChange={(e) => setSuggestionToAdd(e.target.value)}
        fullWidth
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        sx={{ marginBottom: 2 }}
      />
      <Button onClick={() => addSuggestion(retrivedToken)} variant="contained">
        Add
      </Button>
      <MessageModal open={messageModal} text={message} handleClose={() => setMessageModal(false)} />
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

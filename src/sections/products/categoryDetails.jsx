import { Box, Grid, Paper, Button, TextField, Typography } from '@mui/material';

import AppCurrentVisits from '../overview/app-current-visits';


export default function CategoryDetails() {
  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h3" color="red" gutterBottom>
        category name
      </Typography>
      <Grid>
        {2 > 0 && (
          <AppCurrentVisits
            title="category name details"
            chart={{
              series: [
                {
                  label: 'name',
                  value: 6,
                },
                {
                  label: 'name 2',
                  value: 4,
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
        <Typography variant="h3">{15} TND</Typography>
      </Box>
      <TextField
        label=" Value in TND"
        type="number"
        // onChange={(e) => setValueToIncrease(e.target.value)}
        fullWidth
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        sx={{ marginBottom: 2 }}
      />
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
        <Button
          // onClick={() => handleIncreaseValue('plus', ToIncrease, retrivedToken)}
          variant="contained"
          sx={{ mb: 2 }}
        >
          Increase
        </Button>
        <Button
          // onClick={() => handleIncreaseValue('minus', ToIncrease, retrivedToken)}
          variant="contained"
          sx={{ mb: 2, backgroundColor: 'gray' }}
        >
          Decrease
        </Button>
      </div>
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 6 }}>
        Suggestions:
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
        Add a suggestion:
      </Typography>
      <TextField
        label="Suggestion in TND"
        type="number"
        // value={suggestionToAdd}
        // onChange={(e) => setSuggestionToAdd(e.target.value)}
        fullWidth
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        sx={{ marginBottom: 2 }}
      />
      <Button
      // onClick={() => addSuggestion(retrivedToken)} variant="contained"
      >
        Add
      </Button>
    </Paper>
  );
}

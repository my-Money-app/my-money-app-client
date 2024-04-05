import React from 'react';

import {  Grid,Paper,Container,  Typography, } from '@mui/material';

export default function ProfilePage() {
  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Profile Page
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              User Information
            </Typography>
            {/* Display user information */}
            {/* You can use Typography, List, or any other MUI components to display user details */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Account Settings
            </Typography>
            {/* Display account settings */}
            {/* You can use Typography, List, or any other MUI components to display account settings */}
          </Paper>
        </Grid>
        {/* Add more sections as needed, such as activity feed, recent transactions, etc. */}
      </Grid>
    </Container>
  );
}

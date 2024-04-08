import axios from 'axios';
import React, { useRef, useState, useEffect } from 'react';

import { Grid, Paper, Avatar, Divider, Container, Typography, IconButton } from '@mui/material';

export default function ProfilePage() {
  // Sample user data
  const [user, setUser] = useState();

  // Sample account settings
  const accountSettings = [
    { label: 'Username', value: 'johndoe123' },
    { label: 'Email', value: 'john.doe@example.com' },
    // Add more account settings as needed
  ];
  useEffect(() => {
    getUserData();
  }, []);
  const getUserData = async () => {
    const token = localStorage.getItem('token');
    try {
      // Retrieve token from local storage

      if (!token) {
        throw new Error('Token not found in local storage');
      }

      // Send token to server endpoint using the Authorization header
      const response = await axios.get('http://localhost:3120/auth/get-user', {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the Authorization header
        },
      });

      setUser(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };
  const fileInputRef = useRef(null);

  const handleEditClick = () => {
    // Trigger click event on file input
    fileInputRef.current.click();
  };
  const [isEditing, setIsediting] = useState(false);

  const handleImageChange = (event) => {
    setIsediting(true);
    const imageFile = event.target.files[0];
    previewFiles(imageFile);
  };
  const [tempsrc, setTempsrc] = useState('');
  function previewFiles(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setTempsrc(reader.result);
      console.log('wtf', tempsrc);
    };
  }
  const handleSubmit = async () => {
    setIsediting(false);
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.post('http://localhost:3120/auth/uploadProfileImage', {
        image: tempsrc,
        id: userId,
      });
      console.log('Response:', response.data);
      setTempsrc('');
    } catch (error) {
      console.error('Error :', error);
    }
  };
  return (
    <Container>
      <Grid container justifyContent="center" spacing={3}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" align="center" gutterBottom>
            Welcome, {user?.fullName}!
          </Typography>
        </Grid>

        <Grid item xs={12} md={8} lg={6}>
          <Paper
            elevation={3}
            style={{
              padding: '16px',
              borderRadius: '16px',
              backgroundColor: '#f5f5f5',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Avatar
              alt={user?.fullName}
              src={user?.img || user?.avatar || ''}
              style={{
                width: '150px',
                height: '150px',
                margin: 'auto',
                marginBottom: '16px',
                border: '4px solid #fff',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            />
            {/* Edit Icon */}
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
              ref={fileInputRef}
              id="profile-image-input"
              placeholder="select an image"
            />
            {isEditing && <IconButton onClick={handleSubmit}>ok</IconButton>}
            <IconButton
              style={{
                position: 'relative',
                left: '55%',
                top: -50,
              }}
              onClick={handleEditClick}
            >
              <img
                src="../../../public/assets/icons/edit.png"
                alt="some"
                style={{ height: 30, width: 30, postion: 'absolute', right: 0, bottom: 0 }}
              />{' '}
            </IconButton>
            <Typography variant="h6" align="center" gutterBottom>
              {user?.fullName}
            </Typography>
            <Typography variant="subtitle1" align="center" gutterBottom>
              {user?.email}
            </Typography>
          </Paper>
          <Paper
            elevation={3}
            style={{
              padding: '16px',
              borderRadius: '16px',
              backgroundColor: '#f5f5f5',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography variant="h6" align="center" gutterBottom>
              User Information
            </Typography>
            <Divider />
            {/* Display user information */}
            {/* You can use Typography, List, or any other MUI components to display user details */}
          </Paper>
          <Paper
            elevation={3}
            style={{
              padding: '16px',
              borderRadius: '16px',
              backgroundColor: '#f5f5f5',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography variant="h6" align="center" gutterBottom>
              Account Settings
            </Typography>
            <Divider />
            {/* Display account settings */}
            {accountSettings.map((setting, index) => (
              <Typography key={index} variant="subtitle1" gutterBottom>
                <strong>{setting.label}:</strong> {setting.value}
              </Typography>
            ))}
          </Paper>
        </Grid>

        {/* Add more sections as needed, such as activity feed, recent transactions, etc. */}
      </Grid>
    </Container>
  );
}

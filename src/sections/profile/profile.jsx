import axios from 'axios';
import React, { useRef, useState, useEffect } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import {
  Grid,
  Paper,
  Stack,
  Avatar,
  TextField,
  Container,
  Typography,
  IconButton,
} from '@mui/material';

import LoadingComponent from '../overview/loading/Loading';

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  // Sample user data
  const [user, setUser] = useState();

  useEffect(() => {
    getUserData();
  }, []);
  const getUserData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      // Retrieve token from local storage

      if (!token) {
        throw new Error('Token not found in local storage');
      }

      // Send token to server endpoint using the Authorization header
      const response = await axios.get('https://my-money-zone.onrender.com/auth/get-user', {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the Authorization header
        },
      });

      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
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
    };
  }
  const retrivedToken = localStorage.getItem('token');

  const handleSubmit = async (token) => {
    setIsediting(false);
    setLoading(true);

    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.post(
        'https://my-money-zone.onrender.com/auth/uploadProfileImage',
        {
          image: tempsrc,
          id: userId,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      alert(response.data.message);
      setLoading(false);
      window.location.reload();
      setTempsrc('');
    } catch (error) {
      console.error('Error :', error);
    }
  };
  const [oldPwd, setOldPwd] = useState();
  const [newPwd, setNewdPwd] = useState();
  const [confirmPwd, setConfirmPwd] = useState();
  const handleOldPwd = (e) => {
    setOldPwd(e.target.value);
  };
  const handleNewPwd = (e) => {
    setNewdPwd(e.target.value);
  };
  const handleConfirmPwd = (e) => {
    setConfirmPwd(e.target.value);
  };
  const handleChangePwd = async (token) => {
    if (confirmPwd !== newPwd) {
      alert('please verify you new password');
    } else if (newPwd === oldPwd) {
      alert('you cannot use the old password');
    } else {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        const response = await axios.put(
          'https://my-money-zone.onrender.com/auth/changepwd',
          {
            userId,
            currentpwd: oldPwd,
            newpwd: confirmPwd,
          },
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (response.status === 200) {
          setLoading(false);
          alert(response.data.message);
        } else {
          console.error(response.data.error); // Log any errors from the server
        }
      } catch (error) {
        console.error('Error changing password:', error);
      }
    }
  };
  return (
    <Container>
      {loading ? (
        <LoadingComponent />
      ) : (
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
                src={tempsrc !== '' ? tempsrc : user?.img || user?.avatar || ''}
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
              {isEditing && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginRight: '20%',
                    marginLeft: '20%',
                  }}
                >
                  <IconButton color="success" onClick={() => handleSubmit(retrivedToken)}>
                    ok
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => {
                      setIsediting(false);
                      setTempsrc('');
                    }}
                  >
                    cancel
                  </IconButton>
                </div>
              )}
              <br />
              <br />

              <Typography variant="h6" align="center" gutterBottom>
                {user?.fullName}
              </Typography>
              <Typography variant="subtitle1" align="center" gutterBottom>
                {user?.email}
              </Typography>
              <br />
              <br />
              <br />

              <Typography variant="h6" align="center" gutterBottom>
                change password
              </Typography>
              <Stack spacing={3}>
                <TextField
                  name="email"
                  label="old password"
                  type="password"
                  onChange={handleOldPwd}
                />
                <br />
                <TextField
                  name="email"
                  label="new password"
                  type="password"
                  onChange={handleNewPwd}
                />
                <br />
                <TextField
                  name="email"
                  label="confirm password"
                  type="password"
                  onChange={handleConfirmPwd}
                />
              </Stack>
              <br />
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <LoadingButton
                  onClick={() => handleChangePwd(retrivedToken)}
                  size="large"
                  type="submit"
                  variant="contained"
                  color="inherit"
                >
                  confirm
                </LoadingButton>
                <LoadingButton size="large" type="submit" variant="contained" color="error">
                  cancel
                </LoadingButton>
              </div>

              {/* Display user information */}
              {/* You can use Typography, List, or any other MUI components to display user details */}
            </Paper>
          </Grid>

          {/* Add more sections as needed, such as activity feed, recent transactions, etc. */}
        </Grid>
      )}
    </Container>
  );
}

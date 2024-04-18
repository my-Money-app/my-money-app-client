import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { account } from 'src/_mock/account';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const [userData, setUserData] = useState(null);
  const userId = localStorage.getItem('userId');
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const Logout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };
  const handleClose = () => {
    setOpen(null);
  };
  const navigate = useNavigate();

  const profileNavigation = () => {
    setOpen(null);
    navigate(`/profile/${userId}`);
  };
  const HomeNavigation = () => {
    setOpen(null);
    navigate("/");
  };
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
      const response = await axios.get('https://my-money-zone.onrender.com/auth/get-user', {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the Authorization header
        },
      });

      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={userData?.img}
          alt={account.displayName}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {userData ? userData.fullName : ''}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {userData?.fullName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {userData?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={HomeNavigation}> Home </MenuItem>
        <MenuItem onClick={profileNavigation}> profile </MenuItem>

        <Divider sx={{ borderStyle: 'dashed', m: 0 }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={Logout}
          sx={{ typography: 'body2', color: 'error.main', py: 1.5 }}
        >
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
